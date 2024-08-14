// apiClient.ts
import axios from 'axios';

const ASSEMBLYAI_API_KEY = 'fb8ede8de7a848338d975c4dcf1bc885';
const ASSEMBLYAI_API_URL = 'https://api.assemblyai.com/v2';

const apiClient = axios.create({
  baseURL: ASSEMBLYAI_API_URL,
  headers: {
    Authorization: ASSEMBLYAI_API_KEY,
    'Content-Type': 'application/json',
  },
});

export default apiClient;
