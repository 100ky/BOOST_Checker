import axios from 'axios';

// Změňte tuto URL na adresu vašeho serveru
const BASE_URL = 'https://bookish-zebra-r4vwvx44rprcppgw-3000.app.github.dev'; // GitHub Codespaces URL

class ApiService {
  static async uploadDocument(documentData) {
    try {
      const response = await axios.post(`${BASE_URL}/api/documents`, documentData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 sekund timeout
      });
      return response.data;
    } catch (error) {
      console.error('Upload error:', error);
      if (error.code === 'ECONNABORTED') {
        throw new Error('Timeout - server neodpovídá');
      } else if (error.response) {
        throw new Error(`Server error: ${error.response.status}`);
      } else if (error.request) {
        throw new Error('Síťová chyba - zkontrolujte připojení');
      } else {
        throw new Error('Neočekávaná chyba');
      }
    }
  }

  static async getDocuments() {
    try {
      const response = await axios.get(`${BASE_URL}/api/documents`, {
        timeout: 10000,
      });
      return response.data;
    } catch (error) {
      console.error('Get documents error:', error);
      throw error;
    }
  }

  static async deleteDocument(id) {
    try {
      const response = await axios.delete(`${BASE_URL}/api/documents/${id}`, {
        timeout: 10000,
      });
      return response.data;
    } catch (error) {
      console.error('Delete document error:', error);
      throw error;
    }
  }

  static async getDocument(id) {
    try {
      const response = await axios.get(`${BASE_URL}/api/documents/${id}`, {
        timeout: 10000,
      });
      return response.data;
    } catch (error) {
      console.error('Get document error:', error);
      throw error;
    }
  }

  static setServerUrl(url) {
    BASE_URL = url;
  }

  static getServerUrl() {
    return BASE_URL;
  }
}

export default ApiService;
