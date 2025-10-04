import { GoogleGenAI, Type } from '@google/genai';

// Vercel's runtime will handle this default export as the serverless function.
export default async function handler(req, res) {
  // Allow POST requests only
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // --- 1. VALIDATION ---
  if (!process.env.API_KEY) {
    console.error("FATAL ERROR: API_KEY is not set in function variables.");
    return res.status(500).json({ success: false, error: 'Server configuration error.' });
  }

  const payload = req.body;

  if (!payload || !payload.type || !payload.prompt) {
    return res.status(400).json({ success: false, error: 'Missing `type` or `prompt` in request.' });
  }
  
  // --- 2. INITIALIZE GEMINI CLIENT ---
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // --- 3. HANDLE REQUEST BASED ON TYPE ---
  try {
    if (payload.type === 'script') {
      // --- SCRIPT GENERATION ---
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
        The user's idea is: "${payload.prompt}"
      `;

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
        return res.status(200).json({ success: true, data: parsedJson });
      } catch (parseError) {
        console.error("Failed to parse JSON response from Gemini:", response.text, parseError);
        throw new Error("Received an invalid format from the content generation API.");
      }

    } else if (payload.type === 'image') {
      // --- IMAGE GENERATION ---
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: payload.prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
      });

      const base64Image = response.generatedImages[0].image.imageBytes;
      const dataUrl = `data:image/jpeg;base64,${base64Image}`;
      return res.status(200).json({ success: true, data: dataUrl });

    } else {
      return res.status(400).json({ success: false, error: 'Invalid request type.' });
    }
  } catch (error) {
    console.error(`Error processing '${payload.type}' request:`, error);
    const errorMessage = error instanceof Error ? error.message : `An error occurred while generating the ${payload.type}.`;
    return res.status(500).json({ success: false, error: errorMessage });
  }
};