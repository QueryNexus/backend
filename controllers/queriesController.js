const { createChatSession } = require("../config/gemini");
const Chat = require("../models/Chat");
const Company = require("../models/Company");
const Query = require("../models/Query");

const handleQuery = async (req, res) => {
  try {
    console.time("Total Query Time");

    const { companyId } = req.params;
    const { query } = req.body;

    // Check if the company exists
    const company = await Company.findById(companyId).lean();
    if (!company) return res.status(404).json({ error: "Company not found" });

    // Fetch chat history
    const chat = await Chat.findOne({ companyId }).lean();
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    // Limit chat history size
    const MAX_HISTORY_LENGTH = 25;
    const geminiHistory = chat.history
      .slice(-MAX_HISTORY_LENGTH)
      .map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

    // Call Gemini API
    console.time("Gemini API Call");
    const chatSession = await createChatSession(geminiHistory);
    const response = await chatSession.sendMessage(query);
    console.timeEnd("Gemini API Call");

    let assistantResponse =
      response.response?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    // 🔹 Remove triple backticks and parse JSON properly
    assistantResponse = assistantResponse.replace(/```json|```/g, "").trim();

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(assistantResponse);

      // Ensure the response contains required fields
      if (
        !parsedResponse.subject ||
        !parsedResponse.mailbody ||
        !parsedResponse.category
      ) {
        throw new Error("Invalid AI response format");
      }
    } catch (err) {
      console.error("Error parsing AI response:", err);
      parsedResponse = {
        subject: "Error",
        mailbody: "We encountered an issue processing your query.",
        category: "Unknown",
      };
    }

    console.timeEnd("Total Query Time");
    const dbQuery = new Query({
      companyId,
      query,
      category: parsedResponse.category,
      response: parsedResponse.mailbody,

    })

    await dbQuery.save();

    res.json({
      message: "Query handled successfully",
      response: parsedResponse,
    });
  } catch (error) {
    console.error("Error in chat route:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};
const getCompanyQueries = async (req, res) => {
  try {
    const { companyId } = req.params;

    // Check if the company exists
    const company = await Company.findById(companyId).lean();
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    // Fetch all queries for the company
    const queries = await Query.find({ companyId })
      .sort({ createdAt: -1 }) // Sort by newest first
      .lean();

    res.json({
      message: "Queries fetched successfully",
      queries,
    });
  } catch (error) {
    console.error("Error fetching company queries:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

module.exports = { handleQuery, getCompanyQueries };
