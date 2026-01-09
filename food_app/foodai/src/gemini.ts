import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateCombo(
  ingredients: string,
  mood: string,
  dietary: string[],
  mealType: string
) {
  // Fallback to gemini-2.5-flash
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `You are a friendly, experienced home cook who loves creating comforting, delicious meals. 
  The user has these ingredients: "${ingredients}".
  The user is craving something: "${mood}".
  Dietary Preferences: ${dietary.join(', ') || "None"}.
  Meal Type: ${mealType}.
  
  Suggest a wonderful, wholesome dish using these inputs. 
  Give it a cozy name.
  Provide a warm description and explain why it's perfect for their mood.
  
  Format the response as JSON with these exact keys:
  {
    "name": "Name of the Dish",
    "description": "Short, appetizing description",
    "reason": "Why this feels like a hug in a bowl (or plate)",
    "time": "Total cooking time (e.g., '30 mins')",
    "difficulty": "Easy, Medium, or Hard",
    "calories": "Estimated calories per serving",
    "ingredients": [
      { "item": "Ingredient Name", "amount": "Quantity" }
    ],
    "steps": [
      "Step 1 instruction...",
      "Step 2 instruction..."
    ]
  }
  Do not include markdown formatting. Just the raw JSON string.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    // Clean up potential markdown code blocks
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error generating food combo:", error);
    throw error;
  }
}
