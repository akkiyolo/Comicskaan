import { Client, Functions } from 'appwrite';
import { APPWRITE_CONFIG } from '../constants';

const client = new Client()
  .setEndpoint(APPWRITE_CONFIG.endpoint)
  .setProject(APPWRITE_CONFIG.projectId);

export const functions = new Functions(client);

export const executeFunction = async (functionId: string, data?: any) => {
  try {
    const response = await functions.createExecution(
      functionId,
      JSON.stringify(data || {}),
      false
    );
    return response;
  } catch (error) {
    console.error('Function execution error:', error);
    throw error;
  }
};