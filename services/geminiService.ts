import { GoogleGenAI, Type } from "@google/genai";
import { ComicPanelData } from '../types';

// Per guidelines, API key must come from process.env.API_KEY
if (!process.env.API_KEY) {
  // In a real-world scenario, you'd want to handle this more gracefully,
  // maybe showing an error message to the user.
  // For this project, we'll throw an error to make the issue clear during development.
  throw new Error("FATAL ERROR: API_KEY is not set in environment variables.");
}

// Initialize the GoogleGenAI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a comic script by calling the Gemini API.
 * @param storyIdea The user's prompt for the comic story.
 * @returns A promise that resolves to an array of comic panel data.
 */
export const generateComicScript = async (storyIdea: string): Promise<ComicPanelData[]> => {
  const comicScriptSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        panel_number: { type: Type.INTEGER, description: "The sequential number of the comic panel (1, 2, 3, etc.)." },
        scene_description: { type: Type.STRING, description: "A vivid, one-sentence description of the scene and action." },
        dialogue: { type: Type.STRING, description: "Short, natural dialogue or narration for the panel. Can be an empty string if there is no speech." },
        image_prompt: { type: Type.STRING, description: "A detailed text-to-image prompt to generate the art for this panel in a consistent comic book style." },
      },
      required: ["panel_number", "scene_description", "dialogue", "image_prompt"],
    },
  };

  const SCRIPT_GENERATION_PROMPT = `
    You are an expert comic book writer.
    Based on the user's idea, create a complete, short comic strip story with 4-6 panels, a clear beginning, middle, and a satisfying conclusion. The story must feature multiple characters.
    For each panel, provide a JSON object with the panel number, a scene description, dialogue, and a highly detailed image prompt.
    Ensure character descriptions in the image prompts are consistent across all panels.
    The user's idea is: "${storyIdea}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: SCRIPT_GENERATION_PROMPT,
      config: {
        responseMimeType: "application/json",
        responseSchema: comicScriptSchema,
      },
    });

    try {
      const parsedJson = JSON.parse(response.text);
      return parsedJson;
    } catch (parseError) {
      console.error("Failed to parse JSON response from Gemini:", response.text, parseError);
      throw new Error("Received an invalid format from the content generation API.");
    }
  } catch (error) {
    console.error("Error generating comic script:", error);
    const errorMessage = error instanceof Error ? error.message : "An error occurred while generating the script.";
    throw new Error(errorMessage);
  }
};

/**
 * Generates an image for a comic panel by calling the Gemini API.
 * @param prompt The detailed prompt for the image.
 * @returns A promise that resolves to a base64 data URL of the generated image.
 */
export const generatePanelImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1',
      },
    });

    const base64Image = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64Image}`;
  } catch (error) {
    console.error("Error generating panel image:", error);
    const errorMessage = error instanceof Error ? error.message : "An error occurred while generating the image.";
    throw new Error(errorMessage);
  }
};