const express = require("express");
const cors = require("cors");
const Axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const mongoose = require("mongoose");
const Code = require("./models/CodeSchema.model.js");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());

app.use(express.json());
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_URL);





// MongoDB Connection
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 50,
})
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err.message));



    app.post("/optimize",async(req,res)=>{
        const userCode=req.body.code;
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt= `Optimize the following code and include comments for readablity :\n\n${userCode}\n\nProvide the improved code  only.`;
            const result = await model.generateContent(prompt);
            console.log(result.response.text());
            res.json({code:result.response.text()})
        } catch (error) {
            console.error(error);
            res.status(500).send("Error optimizing code");
        }
    })


// Health Check Endpoint
app.get("/", (req, res) => {
    res.status(200).send("Server is running!");
});

// Compile Code Endpoint
app.post("/compile", async (req, res) => {
    // getting the required data from the request
    let code = req.body.code;
    let language = req.body.language;
    let input = req.body.input;
    let userId = req.body.userId; // Ensure userId is sent in the request body

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    let languageMap = {
        "c": { language: "c", version: "10.2.0" },
        "cpp": { language: "c++", version: "10.2.0" },
        "python": { language: "python", version: "3.10.0" },
        "java": { language: "java", version: "15.0.2" } 
    };

    if (!languageMap[language]) {
        return res.status(400).send({ error: "Unsupported language" });
    }

    let data = {
        "language": languageMap[language].language,
        "version": languageMap[language].version,
        "files": [
            {
                "name": "main",
                "content": code
            }
        ],
        "stdin": input
    };

    let config = {
        method: 'post',
        url: 'https://emkc.org/api/v2/piston/execute',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    // calling the code compilation API
    Axios(config)
    .then(async (response) => {
        if (response.data.run.stdout) {
            res.json({ output: response.data.run.stdout });
            
            // Save the successfully compiled code to the database
            Code.create({ userId, code, language }).catch(console.error);
            console.log("data saved in db ");
            

           
        } else if (response.data.run.stderr) {
            res.json({ error: response.data.run.stderr });
        } else {
            res.status(500).json({ error: "Unexpected response format" });
        }
    })
    .catch((error) => {
        console.error("Error during code execution:", error.message);
        res.status(500).json({ error: "Internal server error or connection issue" });
    });
});


// get the code using user'id
app.get("/getcode",async(req,res)=>{
    const userId = req.query.userId;
    const response=await Code.find({userId:userId})

    for (lastElement in response);
    lastElement;
 
    console.log( response[lastElement] + "'");
    
    res.status(200).send(response[lastElement])
})



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
