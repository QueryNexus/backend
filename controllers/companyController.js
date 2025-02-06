const Company = require("../models/Company");
const Chat = require("../models/Chat");
const { createChatSession } = require("../config/gemini");
const { initialPromptGenerator } = require("../utils/initialPromptGenerator");

const companyController = {
  createCompany: async (req, res) => {
    try {
      const companyData = req.body;

      // Create new company
      const newCompany = new Company({
        ...companyData,
      });
      await newCompany.save();

      // Generate initial prompt
      const initialPrompt = initialPromptGenerator(companyData);

      // Create chat session and save initial interaction
      const chatSession = await createChatSession();
      const response = await chatSession.sendMessage(initialPrompt);

      // Create new chat
      const newChat = new Chat({
        companyId: newCompany._id,
        history: [
          {
            role: "user",
            content: initialPrompt,
          },
          {
            role: "assistant",
            content: response.text(),
          },
        ],
      });
      await newChat.save();

      res.status(201).json({
        message: "Company created successfully",
        company: newCompany,
      });
    } catch (error) {
      console.error("Error creating company:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  updateCompany: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedCompany = await Company.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );

      if (!updatedCompany) {
        return res.status(404).json({ message: "Company not found" });
      }

      res.status(200).json({
        message: "Company updated successfully",
        company: updatedCompany,
      });
    } catch (error) {
      console.error("Error updating company:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = companyController;
