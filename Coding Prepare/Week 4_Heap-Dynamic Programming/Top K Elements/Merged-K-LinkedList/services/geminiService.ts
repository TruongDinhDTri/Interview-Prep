import { GoogleGenAI } from "@google/genai";
import { GEMINI_MODEL_NAME } from "../constants";
import { AlgorithmState } from "../types";

export const getExplanation = async (currentState: AlgorithmState): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key not found in environment variables");
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      You are a friendly computer science tutor specializing in Data Structures.
      The user is visualizing the "Merge K Sorted Lists" algorithm using a Min-Heap.
      
      Current State of the Algorithm:
      - Result List So Far: [${currentState.result.map(n => n.val).join(', ')}]
      - Current Heap (Min-Heap property): [${currentState.heap.map(n => n.val).join(', ')}]
      - Last Action: ${currentState.message}
      
      Please provide a short, concise, and encouraging explanation of what just happened and why it is important for the algorithm's efficiency. 
      Focus on the "Why". Why did we pick that specific number? Why do we use a Heap?
      Keep it under 3 sentences.
    `;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
    });

    return response.text || "Could not generate explanation.";
  } catch (error) {
    console.error("Error fetching Gemini explanation:", error);
    return "I'm having trouble connecting to my brain right now. Please check your API key.";
  }
};

export const generateNewLists = async (): Promise<number[][]> => {
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) return [[1,2], [3,4]];

        const ai = new GoogleGenAI({ apiKey });
        const prompt = `Generate a JSON object containing 3 to 4 sorted arrays of integers. 
        The arrays should have between 3 and 6 random integers each. 
        Example format: { "lists": [[1,5,9], [2,4,6], [0,10,11]] }
        Return ONLY the JSON.`;

        const response = await ai.models.generateContent({
            model: GEMINI_MODEL_NAME,
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        
        const text = response.text;
        if (!text) return [[1,2], [3,4]];
        
        const parsed = JSON.parse(text);
        return parsed.lists;
    } catch (e) {
        console.error(e);
        return [[1, 5, 9], [2, 6, 8], [3, 4, 7]]; // Fallback
    }
}