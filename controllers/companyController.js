const Chat = require("../models/Chat");
const Company = require("../models/Company");
const User = require("../models/User");

const createCompany = async (req, res) => {
  try {
    const { uid, ...companyData } = req.body; // Extract uid separately
    const user = await User.findOne({ uid });

    if (!user) return res.status(404).json({ message: "User not found" });

    const oldcompany = await Company.findOne({
      uid: uid,
      name: companyData.name,
    });
    if (oldcompany) {
      return res
        .status(400)
        .json({ message: "Company Already Exists", id: oldcompany.id });
    }

    // Create and save the company
    const company = new Company({ uid, ...companyData });
    await company.save();

    // Associate company with user
    user.companyIds.push(company._id);
    await user.save();

    // Convert company data into structured history entries
    const history = Object.entries(companyData).map(([key, value]) => ({
      role: "user",
      content: `${key}: ${ JSON.stringify(value)}`,
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

    return res.status(201).json({
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

const getCompany = async (req, res) => {
  try {
    const { id } = req.params;

    // Find company by ID
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Find the user associated with the company
    const user = await User.findOne({ uid: company.uid });

    // Return company data along with user info if available
    res.status(200).json({
      company
    });
  } catch (error) {
    console.error("Error fetching company:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find company by ID
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Update company
    const updatedCompany = await Company.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    // Find all chat sessions for this company
    const chats = await Chat.find({ companyId: id });

    // Update the company info in chat history for each chat
    for (const chat of chats) {
      // Save the instruction (last message)
      const instructionMessage = chat.history[chat.history.length - 1];

      // Create new history with updated company data
      const newHistory = Object.entries({
        ...company.toObject(),
        ...updateData,
      })
        .filter(
          ([key]) =>
            key !== "_id" &&
            key !== "__v" &&
            key !== "uid" &&
            key !== "createdAt" &&
            key !== "updatedAt"
        )
        .map(([key, value]) => ({
          role: "user",
          content: `${key}: ${JSON.stringify(value)}`,
        }));

      // Add back the instruction message
      newHistory.push(instructionMessage);

      // Replace the history
      chat.history = newHistory;
      await chat.save();
    }

    res.status(200).json({
      message: "Company updated successfully",
      company: updatedCompany,
    });
  } catch (error) {
    console.error("Error updating company:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    // Find company by ID
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Find associated user
    const user = await User.findOne({ uid: company.uid });

    // Delete all chats related to this company
    await Chat.deleteMany({ companyId: id });

    // Remove company reference from user if exists
    if (user) {
      user.companyIds = user.companyIds.filter(
        (companyId) => companyId.toString() !== id
      );
      await user.save();
    }

    // Delete the company
    await Company.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: "Company and associated data deleted successfully" });
  } catch (error) {
    console.error("Error deleting company:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  createCompany,
  getCompany,
  updateCompany,
  deleteCompany,
};
