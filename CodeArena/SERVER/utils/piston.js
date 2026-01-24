const axios = require('axios');

exports.executeCode=async function executeCode(language, sourceCode, stdin) {
    const versionMap = {
        "cpp": "10.2.0",
        "java": "15.0.2",
        "python": "3.10.0",
        "javascript": "18.15.0"
    };

    const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
        language: language,
        version: versionMap[language] || "latest",
        files: [{ content: sourceCode }],
        stdin: stdin
    });
    return response.data;
}