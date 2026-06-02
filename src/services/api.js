import axios from 'axios';
<<<<<<< HEAD

const API_URL = 'https://todobackend-lfr1.onrender.com/api';
=======
import { Platform } from 'react-native';

const API_URL = Platform.OS === 'android'
  ? 'https://todobackend-lfr1.onrender.com/api' : 'https://todobackend-lfr1.onrender.com/api';
>>>>>>> 1a36b0601fcf0b61e09b128dc33adc1e75506d4e

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
