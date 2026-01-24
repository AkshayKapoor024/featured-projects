const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function generateFromGroq(prompt) {
  const chatCompletion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.5,
    max_tokens: 5500, // <--- INCREASE THIS to at least 4096
    response_format: { type: "json_object" }
  });

  return chatCompletion.choices[0].message.content;
}

module.exports = { generateFromGroq };