import { Client, Account, Functions } from 'appwrite';
import { ComicPanelData } from '../types';

// --- Appwrite Configuration ---
// The project ID is now read from Appwrite's injected environment variables when deployed.
// For local development, you can manually replace 'YOUR_PROJECT_ID' below.
const APPWRITE_PROJECT_ID = (window as any).__APPWRITE_ENV__?.APPWRITE_PROJECT_ID || 'YOUR_PROJECT_ID';
const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
const APPWRITE_FUNCTION_ID = 'generate-comic';
// -----------------------------

const client = new Client();
client
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

const account = new Account(client);
const functions = new Functions(client);

// This function checks for the placeholder ID and throws a clear error.
const checkConfiguration = () => {
    if (APPWRITE_PROJECT_ID === 'YOUR_PROJECT_ID') {
        throw new Error(
            "Appwrite configuration error: Project ID is not set.\n\n" +
            "1. For local development, replace 'YOUR_PROJECT_ID' in services/geminiService.ts.\n" +
            "2. When deploying to Appwrite Hosting, set the 'APPWRITE_PROJECT_ID' environment variable in your project's hosting settings."
        );
    }
};

// Lazily create and manage the anonymous user session.
let sessionPromise: Promise<void> | null = null;
const ensureSession = () => {
    if (!sessionPromise) {
        sessionPromise = (async () => {
            try {
                await account.get();
            } catch (err) {
                // If no session, create an anonymous one.
                await account.createAnonymousSession();
            }
        })();
    }
    return sessionPromise;
};


// Helper to call the Appwrite function
const callAppwriteFunction = async (payload: object) => {
    // The configuration and session checks are now done here, right before the network call.
    checkConfiguration();
    await ensureSession();

    try {
        const result = await functions.createExecution(
            APPWRITE_FUNCTION_ID,
            JSON.stringify(payload),
            false // sync execution
        );
        
        if (result.status === 'completed') {
            const response = JSON.parse(result.responseBody);
            if (response.success) {
                return response.data;
            } else {
                throw new Error(response.error || 'Function execution failed.');
            }
        } else {
            throw new Error(`Function execution failed with status: ${result.status}. Response: ${result.responseBody}`);
        }
    } catch (error) {
        console.error("Appwrite function call failed:", error);
        // If the error is the config error, re-throw it to be displayed in the UI.
        if (error instanceof Error && error.message.startsWith('Appwrite configuration error')) {
            throw error;
        }
        throw new Error("Failed to communicate with the AI service.");
    }
};

export const generateComicScript = async (userPrompt: string): Promise<ComicPanelData[]> => {
    const payload = { type: 'script', prompt: userPrompt };
    const scriptData = await callAppwriteFunction(payload);
    
    if (!Array.isArray(scriptData) || scriptData.length === 0) {
        throw new Error("AI returned an invalid script format.");
    }
    return scriptData;
};

export const generatePanelImage = async (imagePrompt: string): Promise<string> => {
    try {
        const payload = { type: 'image', prompt: imagePrompt };
        return await callAppwriteFunction(payload);
    } catch (error) {
        console.error("Error generating panel image via function:", error);
        // If the config is wrong, we want to see that error, not a placeholder.
        if (error instanceof Error && error.message.startsWith('Appwrite configuration error')) {
            throw error;
        }
        // Return a placeholder image on other failures to not break the UI
        return "https://picsum.photos/512/512?blur=2"; 
    }
};
