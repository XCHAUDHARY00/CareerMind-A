import axios from 'axios';

// Ek central axios instance banate hain
const api = axios.create({
    // Import base URL from .env file
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default api;
