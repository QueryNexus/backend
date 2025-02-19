const Chat = require("../models/Chat");
const Company = require("../models/Company");
const User = require("../models/User");

const createCompany = async (req, res) => {
  try {
    const { uid, ...companyData } = req.body; // Extract uid separately
    const user = await User.findOne({ uid });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Create and save the company
    const company = new Company({ uid, ...companyData });
    await company.save();

    // Associate company with user
    user.companyIds.push(company._id);
    await user.save();

    // Convert company data into structured history entries
    const history = Object.entries(companyData).map(([key, value]) => ({
      role: "user",
      content: `${key}: ${value}`,
    }));

    // Adding AI instructions as a starting message
history.push({
  role: "assistant",
  content: `You are an AI customer support assistant for **"${companyData.name}"**.

## **Your Role:**  
Assist customers by responding to their queries in a **professional email format** using the company's provided details.

## **Instructions:**  
1. **Use company data** to generate relevant responses.  
   - If key details are missing, provide a general response.  
2. **Categorize the customer query** into one of the following categories:  
   - **High Priority**  
   - **Follow-Up Required**  
   - **Resolved**  
   - **Duplicate Query**  
   - **Needs Escalation**  
   - **Spam**  
   - **Feedback/Compliment**  
3. **Response Format:**  
Always return a JSON object in the following structure:

\`\`\`json
{
  "subject": "Email Subject",
  "mailbody": "Email Body",
  "category": "One of the predefined categories"
}
\`\`\`
      `,
});

    // Create and save the chat session
    const chat = new Chat({ companyId: company._id, history });
    await chat.save();

    res
      .status(201)
      .json({
        message: "Company created successfully",
        companyId: company._id,
      });
  } catch (error) {
    console.error("Error creating company:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Placeholder functions for CRUD operations
const getCompany = async (req, res) => {};
const getCompanies = async (req, res) => {};
const updateCompany = async (req, res) => {};
const deleteCompany = async (req, res) => {};

module.exports = {
  createCompany,
  getCompany,
  getCompanies,
  updateCompany,
  deleteCompany,
};
