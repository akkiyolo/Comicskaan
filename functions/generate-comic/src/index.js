

const { GoogleGenAI, Type } = require('@google/genai');

module.exports = async (req, res) => {
  // --- 1. VALIDATION ---
  // FIX: Per guidelines, API key must come from process.env.API_KEY
  if (!process.env.API_KEY) {
    console.error("FATAL ERROR: API_KEY is not set in function variables.");
    return res.json({ success: false, error: 'Server configuration error.' }, 500);
  }

  let payload;
  try {
    payload = JSON.parse(req.payload);
  } catch (e) {
    console.error("Error parsing request payload:", req.payload);
    return res.json({ success: false, error: 'Invalid request format.' }, 400);
  }

  if (!payload.type || !payload.prompt) {
    return res.json({ success: false, error: 'Missing `type` or `prompt` in request.' }, 400);
  }
  
  // --- 2. INITIALIZE GEMINI CLIENT ---
  // FIX: Per guidelines, API key must come from process.env.API_KEY
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
      
      // FIX: Added a try-catch block for JSON parsing to handle potential non-JSON responses from the API.
      try {
        const parsedJson = JSON.parse(response.text);
        return res.json({ success: true, data: parsedJson });
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
      return res.json({ success: true, data: dataUrl });

    } else {
      return res.json({ success: false, error: 'Invalid request type.' }, 400);
    }
  } catch (error) {
    console.error(`Error processing '${payload.type}' request:`, error);
    const errorMessage = error instanceof Error ? error.message : `An error occurred while generating the ${payload.type}.`;
    return res.json({ success: false, error: errorMessage }, 500);
  }
};
