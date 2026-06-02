import axios from 'axios';
import { Platform } from 'react-native';

const API_URL = Platform.OS === 'android'
  ? 'https://todobackend-lfr1.onrender.com/api' : 'https://todobackend-lfr1.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
