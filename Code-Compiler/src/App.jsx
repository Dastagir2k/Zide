// import { useState, useEffect } from 'react';
// import { Moon, Sun, Play, Trash2 } from 'lucide-react';
// import Editor from '@monaco-editor/react';

// export default function App() {
//   const [language, setLanguage] = useState('javascript');
//   const [darkMode, setDarkMode] = useState(false);
//   const [code, setCode] = useState('');
//   const [input, setInput] = useState('');
//   const [output, setOutput] = useState('');

//   useEffect(() => {
//     // Apply dark mode to the body
//     if (darkMode) {
//       document.body.classList.add('dark');
//     } else {
//       document.body.classList.remove('dark');
//     }
//   }, [darkMode]);

//   const handleRun = () => {
//     // Simulate compilation and execution
//     setOutput(`Simulated output for ${language}:\n${code}\n\nInput:\n${input}`);
//   };

//   const handleClear = () => {
//     setCode('');
//     setInput('');
//     setOutput('');
//   };

//   const getLanguageId = () => {
//     switch (language) {
//       case 'javascript':
//         return 'javascript';
//       case 'python':
//         return 'python';
//       case 'cpp':
//         return 'cpp';
//       default:
//         return 'javascript';
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-all">
//       <nav className="bg-gradient-to-r from-teal-500 to-blue-500 text-white border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center">
//               <span className="font-bold text-xl">Online Compiler</span>
//               <div className="ml-10">
//                 <select
//                   value={language}
//                   onChange={(e) => setLanguage(e.target.value)}
//                   className="w-[180px] p-2 bg-white dark:bg-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
//                 >
//                   <option value="javascript">JavaScript</option>
//                   <option value="python">Python</option>
//                   <option value="cpp">C++</option>
//                 </select>
//               </div>
//             </div>
//             <button
//               className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
//               onClick={() => setDarkMode(!darkMode)}
//             >
//               {darkMode ? (
//                 <Sun className="h-[1.2rem] w-[1.2rem]" />
//               ) : (
//                 <Moon className="h-[1.2rem] w-[1.2rem]" />
//               )}
//               <span className="sr-only">Toggle dark mode</span>
//             </button>
//           </div>
//         </div>
//       </nav>

//       <main className="flex-grow container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-4">
//             <div className="border rounded-md overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
//               <Editor
//                 height="100%"
//                 defaultLanguage="javascript"
//                 language={getLanguageId()}
//                 value={code}
//                 onChange={(value) => setCode(value || '')}
//                 theme={darkMode ? 'vs-dark' : 'light'}
//                 options={{
//                   minimap: { enabled: false },
//                   fontSize: 14,
//                   lineNumbers: 'on',
//                   scrollBeyondLastLine: false,
//                   automaticLayout: true,
//                 }}
//               />
//             </div>
//             <textarea
//               placeholder="Input"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               className="w-full h-32 p-4 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
//             />
//           </div>
//           <div className="space-y-4">
//             <textarea
//               placeholder="Output"
//               value={output}
//               readOnly
//               className="w-full h-full min-h-[400px] p-4 border border-gray-300 rounded-md bg-gray-800 text-white dark:bg-gray-900 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
//             />
//           </div>
//         </div>
//         <div className="mt-4 flex justify-end space-x-4">
//           <button
//             onClick={handleRun}
//             className="py-2 px-6 bg-teal-600 text-white rounded-md flex items-center hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
//           >
//             <Play className="mr-2 h-4 w-4" /> Run
//           </button>
//           <button
//             onClick={handleClear}
//             className="py-2 px-6 border border-gray-300 text-gray-700 rounded-md flex items-center hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
//           >
//             <Trash2 className="mr-2 h-4 w-4" /> Clear
//           </button>
//         </div>
//       </main>
//     </div>
//   );
// }









































































import { useState } from 'react';
import Editor from '@monaco-editor/react';
import Axios from 'axios';
import spinner from './spinner.svg';

function App() {
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
            const res = await Axios.post('http://localhost:3001/compile', {
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
                    <span className="font-bold text-xl">Online Compiler</span>
                    <div className="flex items-center space-x-4">
                        <select
                            className="p-2 bg-white dark:bg-gray-700 border border-gray-300 rounded-md"
                            value={userLang}
                            onChange={(e) => setUserLang(e.target.value)}
                        >
                            <option value="python">Python</option>
                            <option value="javascript">JavaScript</option>
                            <option value="cpp">C++</option>
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
