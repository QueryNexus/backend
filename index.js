require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const { createChatSession } = require("./config/gemini");
const userRouter = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middleware
app.use(express.json());

app.use(userRouter);

// Test route
app.get("/", async (req, res) => {
    res.send("API is running...");
});
app.get("/askMe", async (req, res) => {
    const {query} = req.body;
  const chatSession = await createChatSession();
  const response = await chatSession.sendMessage(query);
  res.status(200).json(response.response.candidates[0].content.parts);
});



// Start server
app.listen(PORT, () => {
  console.log(`Server running on  http://localhost:${PORT}`);
});
