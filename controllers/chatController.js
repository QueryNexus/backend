const Chat = require("../models/Chat");
const Response = require("../models/Response");
const { createChatSession } = require("../config/gemini");

const chatController = {
  getResponse: async (req, res) => {
    try {
      const { chatId } = req.params;
      const { question } = req.body;

      // Get chat history
      const chat = await Chat.findById(chatId);
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      // Create chat session with history
      const chatSession = await createChatSession(chat.history);

      // Get response from AI
      const response = await chatSession.sendMessage(question);

      // Update chat history
      chat.history.push(
        { role: "user", content: question },
        { role: "assistant", content: response.text() }
      );
      await chat.save();

      // Create response record
      const newResponse = new Response({
        timeframe: new Date(),
        question,
        answer: response.text(),
        chatId,
      });
      await newResponse.save();

      res.status(200).json({
        message: "Response generated successfully",
        response: newResponse,
      });
    } catch (error) {
      console.error("Error generating response:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getChatHistory: async (req, res) => {
    try {
      const { chatId } = req.params;
      const chat = await Chat.findById(chatId);

      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      res.status(200).json({
        history: chat.history,
      });
    } catch (error) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getCompanyChats: async (req, res) => {
    try {
      const { companyId } = req.params;
      const chats = await Chat.find({ companyId });

      res.status(200).json({
        chats,
      });
    } catch (error) {
      console.error("Error fetching company chats:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = chatController;
