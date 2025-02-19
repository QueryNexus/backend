require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const { createChatSession } = require("./config/gemini");
const userRouter = require("./routes/userRoutes");
const companyRouter = require("./routes/companyRouter");
const { initialPromptGenerator } = require("./utils/initialPromptGenerator");
const GeneralChat = require("./models/GeneralChat"); // Adjust the path as needed

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middleware
app.use(express.json());

app.use(userRouter);
app.use(companyRouter);

app.get("/getPrompt",async (req,res)=>{
  const prompt = await initialPromptGenerator(req.body);
  res.status(200).json(prompt);
});


// Test route
app.get("/", async (req, res) => {
    res.send("API is running...");
});

app.post("/askMe", async (req, res) => {
  try {
    const { query, userId } = req.body;

    if (!userId || !query) {
      return res.status(400).json({ error: "userId and query are required" });
    }

    // Find or create a chat document for the user
    let chatDocument = await GeneralChat.findOne({ userId });
    if (!chatDocument) {
      chatDocument = new GeneralChat({ userId, history: [] });
    }

    // Convert MongoDB history to Gemini format with correct role mapping
    const geminiHistory = chatDocument.history.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Create chat session with existing history
    const chatSession = await createChatSession(geminiHistory);

    // Get response from Gemini
    const response = await chatSession.sendMessage(query);
    const assistantResponse =
      response.response.candidates[0].content.parts[0].text;

    // Update history in MongoDB (keeping 'assistant' role in our DB)
    chatDocument.history.push(
      { role: "user", content: query },
      { role: "assistant", content: assistantResponse }
    );
    await chatDocument.save();

    res.status(200).json({
      message: assistantResponse,
    });
  } catch (error) {
    console.error("Error in chat route:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on  http://localhost:${PORT}`);
});
