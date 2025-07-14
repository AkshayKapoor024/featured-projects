const { VertexAI } = require('@google-cloud/vertexai');

// Set region and model
const vertexAI = new VertexAI({
  project: 'schedulo-464407',
  location: 'us-central1',
  keyFilename: '../vertex-key.json'
});

const model = vertexAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024
  },
  safetySettings: [
    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 3 },
    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 3 },
    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 3 },
    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 3 }
  ]
});

module.exports = model;