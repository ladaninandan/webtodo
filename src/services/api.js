import axios from 'axios';
import { Platform } from 'react-native';

const API_URL = Platform.OS === 'android'
  ? 'http://192.168.29.145:5050/api' : 'http://localhost:5050/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
