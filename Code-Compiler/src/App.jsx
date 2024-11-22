
import { useState } from 'react';
import Editor from '@monaco-editor/react';
import Axios from 'axios';
import spinner from './spinner.svg';

function App() {
    console.log("ide is working");
    
    // State variables
    const [userCode, setUserCode] = useState(''); // User code
    const [userLang, setUserLang] = useState('python'); // Language selected
    const [userTheme, setUserTheme] = useState('vs-dark'); // Theme selected
    const [fontSize, setFontSize] = useState(20); // Font size for the editor
    const [userInput, setUserInput] = useState(''); // User input for the code
    const [userOutput, setUserOutput] = useState(''); // Output from the code
    const [loading, setLoading] = useState(false); // Loading state for the API call

    // Monaco Editor options
    const options = {
        fontSize: fontSize,
    };

    // Monaco editor will mount
    function handleEditorWillMount(monaco) {
        monaco.languages.registerCompletionItemProvider('python', {
            provideCompletionItems: () => {
                const suggestions = [
                    {
                        label: 'print',
                        kind: monaco.languages.CompletionItemKind.Function,
                        insertText: 'print(${1})',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Outputs a message to the console.',
                    },
                    {
                        label: 'input',
                        kind: monaco.languages.CompletionItemKind.Function,
                        insertText: 'input(${1})',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Gets user input.',
                    },
                    {
                        label: 'for loop',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: 'for i in range(${1}):\n\t${2}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Python for loop.',
                    },
                ];
                return { suggestions: suggestions };
            },
        });
    }

    // Function to call the compile endpoint
    async function compile() {
        setLoading(true);
        if (userCode === '') {
            setLoading(false); // Ensure loading is turned off if there's no code
            return;
        }

        try {
            const res = await Axios.post('http://localhost:8000/compile', {
                code: userCode,
                language: userLang,
                input: userInput,
            });

            if (res.data.error) {
                setUserOutput('Error: ' + res.data.error);
            } else {
                setUserOutput(res.data); // If there's output, display it
            }
        } catch (err) {
            setUserOutput('Error: ' + (err.response ? err.response.data.error : err.message));
        } finally {
            setLoading(false); // Ensure loading is turned off after the request finishes
        }
    }

    // Function to clear the output screen
    function clearOutput() {
        setUserOutput('');
    }

    return (
        <div className="App bg-white dark:bg-gray-900 text-black dark:text-white">
            {/* Navbar */}
            <nav className="bg-gradient-to-r from-teal-500 to-blue-500 text-white p-4">
                <div className="flex items-center justify-between">
                    <span className="font-bold text-xl">zIDE Compiler</span>
                    <div className="flex items-center space-x-4">
                        <select
                            className="p-2 bg-white dark:bg-gray-700 border border-gray-300 rounded-md"
                            value={userLang}
                            onChange={(e) => setUserLang(e.target.value)}
                        >
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                            <option value="cpp">C++</option>
                            <option value="javascript">Javascript</option>
                        </select>
                        <button
                            onClick={() =>
                                setUserTheme(userTheme === 'vs-dark' ? 'vs' : 'vs-dark')
                            }
                            className="p-2 rounded-full bg-gray-700 dark:bg-gray-300 hover:bg-gray-600 dark:hover:bg-gray-400"
                        >
                            <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            <div className="flex h-screen">
                {/* Left Container - Code Editor */}
                <div className="w-2/3 p-4">
                    <Editor
                        height="calc(100vh - 150px)"
                        width="100%"
                        theme={userTheme}
                        language={userLang}
                        value={userCode}
                        options={options}
                        onChange={(value) => setUserCode(value)}
                        beforeMount={handleEditorWillMount}
                    />
                    <button
                        className="mt-4 bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600"
                        onClick={compile}
                    >
                        Run
                    </button>
                </div>

                {/* Right Container - Input & Output */}
                <div className="w-1/3 p-4">
                    <h4 className="text-xl font-semibold">Input:</h4>
                    <textarea
                        className="w-full p-2 bg-gray-200 dark:bg-gray-700 border rounded-md"
                        rows="6"
                        placeholder="Enter input for the code"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                    ></textarea>

                    <h4 className="mt-4 text-xl font-semibold">Output:</h4>
                    <div className="output-box bg-gray-100 dark:bg-gray-800 p-4 rounded-md border border-gray-300">
                        {loading ? (
                            <div className="flex justify-center items-center">
                                <img src={spinner} alt="Loading..." className="h-12 w-12" />
                            </div>
                        ) : (
                            <pre>{userOutput}</pre>
                        )}
                        <button
                            className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                            onClick={clearOutput}
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
