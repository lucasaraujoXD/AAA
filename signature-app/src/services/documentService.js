// src/services/documentService.js

import axios from 'axios';

const BASE_URL = 'http://localhost:5000'; // Certifique-se de que este seja o URL correto da sua API

export const saveSignature = async (documentId, userId, signature) => {
  try {
    const response = await axios.post(`${BASE_URL}/signatures`, {
      documentId,
      userId,
      signature,
    });
    return response.data;
  } catch (error) {
    console.error('Error saving signature:', error);
    throw error;
  }
};

export const getPendingDocuments = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/pending-documents`);
    return response.data;
  } catch (error) {
    console.error('Error fetching pending documents:', error);
    throw error;
  }
};

export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append('document', file);

  try {
    const response = await axios.post(`${BASE_URL}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};
