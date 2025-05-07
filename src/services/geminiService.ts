import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateSummary(apiKey: string, content: string): Promise<string> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
    Please summarize the following content in a clear and concise manner. 
    Focus on key points, main arguments, and important information.
    Format the summary in paragraphs with clear structure. 
    Content to summarize: 
    
    ${content}
    `;
    
    // Safety settings - keeping default
    const generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    };
    
    // Generate the summary
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });
    
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error in Gemini API service:', error);
    throw new Error('Failed to generate summary using Gemini API');
  }
}