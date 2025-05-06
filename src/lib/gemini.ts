import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBSAmKJrT6uKJFMTp42vwI9Vq08Vm44ITg";
const genAI = new GoogleGenerativeAI(API_KEY);

export const generateResponse = async (message: string, history: { role: string; content: string }[]) => {
  try {
    console.log('Starting Gemini API call...');
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Format the content according to the API spec
    const contents = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Add the current message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    console.log('Sending request with contents:', JSON.stringify(contents, null, 2));

    const result = await model.generateContent({
      contents: contents
    });

    if (!result || !result.response) {
      throw new Error('No response from Gemini API');
    }

    const response = await result.response;
    const text = response.text();
    console.log('Received response:', text);

    if (!text) {
      throw new Error('Empty response from Gemini API');
    }

    return text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }
    return 'I apologize, but I encountered an issue processing your request. Could you please try rephrasing your question?';
  }
}; 