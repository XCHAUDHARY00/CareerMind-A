import axios from 'axios';

// Ek central axios instance banate hain
const api = axios.create({
    // Import base URL from .env file
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Request Interceptor: API call bhejne se pehle ye chalega
api.interceptors.request.use(
    (config) => {
        // Local storage se access token uthao
        const token = localStorage.getItem('access_token');
        if (token) {
            // Agar token hai, toh Authorization header mein attach kar do
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Agar token expire ho gaya ho (401 error) toh auto logout
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            console.log("Token expired or unauthorized. Logging out...");
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            // Redirect to login (window.location is used because we're outside a React component context)
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
