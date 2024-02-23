// api.js
import axios from 'axios';

 const API = axios.create({
    baseURL: '/',
    headers: {
        'Content-Type': 'application/json'
    }
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
});

export default API;
