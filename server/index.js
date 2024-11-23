
const express = require("express");
const cors = require("cors");
const Axios = require("axios");
const app = express();
const PORT = 8000;



app.use(cors({
    origin: 'https://zide.vercel.app'
  }));

app.use(express.json());

app.get("/",(req,res)=>{
    res.status(200).send("HIIIII");
    console.log("Hii");
    
})


app.post("/compile", (req, res) => {
    // getting the required data from the request
    let code = req.body.code;
    let language = req.body.language;
    let input = req.body.input;

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
    .then((response) => {
        // Check if stdout exists, if not check stderr for error message
        if (response.data.run.stdout) {
            res.json( response.data.run.stdout );
            console.log("Code executed successfully, output:", response.data.run.stdout);
        } else if (response.data.run.stderr) {
            const errorMessage = extractError(response.data.run.stderr);

            // Log the extracted error message
            console.error("Error during code execution:", errorMessage);
            res.json({ error: response.data.run.stderr });
            console.error("Error during code execution:", response.data.run.output);
        } else {
            // If both stdout and stderr are empty or missing, send unexpected response format
            res.status(500).json({ error: "Unexpected response format" });
            console.error("Unexpected response format:", response.data);
        }
    })
    .catch((error) => {
        // Log the error from Axios
        console.error("Error during code execution:", error.message);
        
        // If the error is from the API response, log and send the specific error
        if (error.response) {
            console.error("API response error details:", error.response.data);
            res.status(500).json({ error: error.response.data || "Something went wrong with the API" });
        } else {
            // Log any other errors (e.g., network issues)
            console.error("General error:", error);
            res.status(500).json({ error: "Internal server error or connection issue" });
        }
    });

    function extractError(stderr) {
        // Regex to extract the error message, such as NameError, TypeError, etc.
        const regex = /(?:Traceback.*?)(?:\n\s+)([^\n]+)/;
        const match = stderr.match(regex);
    
        if (match) {
            return match; // Return the first matched line, which will be the error message (e.g., "NameError: name 'l' is not defined")
        } else {
            return "Unknown error occurred";
        }
    }

});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});