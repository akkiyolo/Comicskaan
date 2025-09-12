import { Client, Account, Functions } from 'appwrite';
import { ComicPanelData } from '../types';

// --- Appwrite Configuration ---
const APPWRITE_PROJECT_ID = '68c41503001aa43c61aa';
const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
const APPWRITE_FUNCTION_ID = 'generate-comic';
// -----------------------------

// Lazy initialization for the Appwrite client and session
let appwrite: { client: Client; account: Account; functions: Functions } | null = null;
let sessionPromise: Promise<void> | null = null;

const getAppwrite = () => {
    // If the client hasn't been created, create it now.
    if (!appwrite) {
        const client = new Client();
        client
            .setEndpoint(APPWRITE_ENDPOINT)
            .setProject(APPWRITE_PROJECT_ID);

        const account = new Account(client);
        const functions = new Functions(client);
        appwrite = { client, account, functions };
    }
    return appwrite;
};

const ensureSession = () => {
    // If a session promise doesn't exist, create one.
    if (!sessionPromise) {
        sessionPromise = (async () => {
            const { account } = getAppwrite();
            try {
                // Check if a session already exists
                await account.get();
            } catch (err) {
                // If no session, create a new anonymous one
                await account.createAnonymousSession();
            }
        })();
    }
    return sessionPromise;
};


// Helper to call the Appwrite function
const callAppwriteFunction = async (payload: object) => {
    // Ensure both Appwrite client and session are ready before making a call.
    await ensureSession();
    const { functions } = getAppwrite();

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
        // Return a placeholder image on failures to not break the UI
        return "https://picsum.photos/512/512?blur=2"; 
    }
};
