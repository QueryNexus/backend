const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();


const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing in the environment variables");
}
const genAI = new GoogleGenerativeAI(apiKey);

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function createChatSession(history = []) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


    const chatSession = model.startChat({
      history,
      generationConfig,
    });

    return chatSession;
  } catch (error) {
    console.error("Error initializing chat session:", error);
    throw error;
  }
}

module.exports = {
  createChatSession,
};
