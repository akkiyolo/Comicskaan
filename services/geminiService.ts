// FIX: Removed 'Method' from appwrite import as it is not an exported member.
import { Client, Account, Functions, ID } from 'appwrite';
import { ComicPanelData } from '../types';

// Use the project ID from your Appwrite project dashboard.
const APPWRITE_PROJECT_ID = '68c4034300117d0d9f52'; 
const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
const FUNCTION_ID = 'generate-comic';

// Initialize the Appwrite client
const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

const account = new Account(client);
const functions = new Functions(client);

// This function ensures we have an active session to call the function.
const getSession = async () => {
    try {
        // Check if a session already exists
        await account.get();
    } catch (error) {
        // If no session, create an anonymous one
        await account.createAnonymousSession();
    }
};

/**
 * Generates a comic script by calling the secure Appwrite backend function.
 * @param storyIdea The user's prompt for the comic story.
 * @returns A promise that resolves to an array of comic panel data.
 */
export const generateComicScript = async (storyIdea: string): Promise<ComicPanelData[]> => {
    await getSession(); // Ensure we are logged in
    
    const payload = {
        type: 'script',
        prompt: storyIdea,
    };

    try {
        // FIX: The `method` argument is optional and defaults to 'POST'. Removing it to fix the ExecutionMethod type error.
        const result = await functions.createExecution(
            FUNCTION_ID,
            JSON.stringify(payload),
            false, // sync execution
            '/' // path
        );

        if (result.responseStatusCode !== 200) {
            const errorResponse = JSON.parse(result.responseBody);
            throw new Error(errorResponse.error || `Function execution failed with status: ${result.responseStatusCode}`);
        }
        
        const responseBody = JSON.parse(result.responseBody);

        if (!responseBody.success) {
            throw new Error(responseBody.error || 'The backend function returned an error.');
        }

        return responseBody.data;

    } catch (error) {
        console.error("Error executing generateComicScript function:", error);
        if (error instanceof Error && error.message.includes('network')) {
             throw new Error("Network error. Please check your Appwrite project's Platform settings (CORS).");
        }
        throw error;
    }
};

/**
 * Generates an image for a comic panel by calling the secure Appwrite backend function.
 * @param prompt The detailed prompt for the image.
 * @returns A promise that resolves to a base64 data URL of the generated image.
 */
export const generatePanelImage = async (prompt: string): Promise<string> => {
    await getSession(); // Ensure we are logged in

    const payload = {
        type: 'image',
        prompt: prompt,
    };
    
    try {
        // FIX: The `method` argument is optional and defaults to 'POST'. Removing it to fix the ExecutionMethod type error.
        const result = await functions.createExecution(
            FUNCTION_ID,
            JSON.stringify(payload),
            false, // sync execution
            '/' // path
        );

        if (result.responseStatusCode !== 200) {
            const errorResponse = JSON.parse(result.responseBody);
            throw new Error(errorResponse.error || `Function execution failed with status: ${result.responseStatusCode}`);
        }

        const responseBody = JSON.parse(result.responseBody);

        if (!responseBody.success) {
            throw new Error(responseBody.error || 'The backend function returned an error.');
        }
        
        return responseBody.data;

    } catch (error) {
        console.error("Error executing generatePanelImage function:", error);
        throw error;
    }
};
