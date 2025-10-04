import { ComicPanelData } from '../types';

// This function now acts as a client to our own backend endpoint,
// which securely handles the Gemini API calls.

/**
 * A helper function to call our Vercel serverless function.
 * @param type The type of generation to perform ('script' or 'image').
 * @param prompt The user's input or image prompt.
 * @returns A promise that resolves to the data from the backend.
 */
const callApi = async <T>(type: 'script' | 'image', prompt: string): Promise<T> => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, prompt }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      // Use the error from the backend if available, otherwise a generic one.
      throw new Error(result.error || `Failed to generate ${type}.`);
    }

    return result.data;
  } catch (error) {
    console.error(`Error calling API for ${type}:`, error);
    const errorMessage = error instanceof Error ? error.message : `An unknown error occurred while generating the ${type}.`;
    // Re-throw the error to be caught by the component
    throw new Error(errorMessage);
  }
};


/**
 * Generates a comic script by calling our backend endpoint.
 * @param storyIdea The user's prompt for the comic story.
 * @returns A promise that resolves to an array of comic panel data.
 */
export const generateComicScript = async (storyIdea: string): Promise<ComicPanelData[]> => {
  return callApi<ComicPanelData[]>('script', storyIdea);
};

/**
 * Generates an image for a comic panel by calling our backend endpoint.
 * @param prompt The detailed prompt for the image.
 * @returns A promise that resolves to a base64 data URL of the generated image.
 */
export const generatePanelImage = async (prompt: string): Promise<string> => {
  return callApi<string>('image', prompt);
};
