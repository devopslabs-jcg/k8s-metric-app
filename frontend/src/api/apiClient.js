// frontend/src/api/apiClient.js

import axios from 'axios';

const apiClient = axios.create({
  // 'http://localhost:5000/api' 대신 상대 경로 '/api'
  baseURL: '/api', 
});

export default apiClient;
