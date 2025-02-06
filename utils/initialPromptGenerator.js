import { createChatSession } from "../config/gemini";

export const initialPromptGenerator = async (data) => {
  const prompt = `
     You are an AI assistant that converts structured company data into a well-formed customer-facing response.
    Instructions:  
    - Read the company data provided under the \`data\` key (or detect the structure if unspecified).  
    - Extract and organize the following details:  
    - Name  
    - Description (if available)  
    - Services offered  
    - SaaS products (if any)  
    - Headquarters location  
    - Branch and international office locations  
    - Partnership opportunities and process  
    - Customer support details, including availability, hours, and premium options  
    - Contact methods (phone, email, website)  
    - Payment options (if applicable)  
    - Refund or cancellation policy (if mentioned)  
    - Shipping & delivery policy (for product-based businesses)  
    - Upcoming events  
    - Promotions or special offers  

    Ensure the response is professional, structured naturally, and customer-friendly.  

    Begin the response with:  
    "Act as a customer care representative for [Company Name], a company offering [services]..."  

    Include all relevant details, ensuring smooth transitions and clear information delivery.  

    End the response compulsarily with:  
    "For each customer query, provide a response and categorize it into one of these categories: High Priority, Follow-Up Required, Resolved, Duplicate Query, Needs Escalation, Spam, Feedback/Compliment. The output should only include an object with two attributes: \`response\` (your reply in email format like customer care reply to customers) and \`category\` (the query category). , from next prompt the users will give you queries , if you understood what to do now repond me yes"  

    data: ${JSON.stringify(data)}
  `;
  const chatSession = await createChatSession();
  const response = await chatSession.sendMessage(prompt);
  return response.response.candidates[0].content.parts;
};
