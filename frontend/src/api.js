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

// Response Interceptor: 401 error aane par auto token refresh
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Agar response status 401 hai aur ye retry request nahi hai
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry &&
            originalRequest.url &&
            !originalRequest.url.includes('/login/') &&
            !originalRequest.url.includes('/token/refresh/')
        ) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');

            if (refreshToken) {
                try {
                    // clean instance context-wise for refresh call to avoid loop
                    const refreshInstance = axios.create({
                        baseURL: import.meta.env.VITE_API_BASE_URL,
                    });
                    
                    const response = await refreshInstance.post('/token/refresh/', {
                        refresh: refreshToken,
                    });

                    if (response.status === 200 && response.data.access) {
                        const newAccessToken = response.data.access;
                        localStorage.setItem('access_token', newAccessToken);

                        // Authorization header update karke request fir se retry karo
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        return api(originalRequest);
                    }
                } catch (refreshError) {
                    console.error("Token refresh failed, logging out...", refreshError);
                }
            }

            console.log("Token expired or unauthorized. Logging out...");
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            // Redirect to login
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

