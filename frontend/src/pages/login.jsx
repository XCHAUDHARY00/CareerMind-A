import React, { useState } from 'react';
import api from '../api';

const Login = () => {
    // State variables (Variables jisme form ka data store hoga)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Jab form submit hoga, toh ye function chalega
    const handleSubmit = async (e) => {
        e.preventDefault(); // Page ko refresh hone se roko
        setIsLoading(true);

        try {
            // Backend ki login API call karenge (Base URL api.js se aayega)
            const response = await api.post('/login/', {
                username: username,
                password: password
            });

            console.log("Login Success! Response:", response.data);
            alert("Login Successful!");

            // JWT tokens (access aur refresh) ko local storage me save karna
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            
            // TODO: Dashboard pe redirect karenge
        } catch (error) {
            console.error("Login failed:", error);
            alert("Login failed! Check credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-md w-full">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                    <h2 className="text-white text-2xl font-bold text-center">Welcome Back</h2>
                    <p className="text-blue-100 text-center mt-1">Sign in to CareerMind AI</p>
                </div>

                {/* Form */}
                <div className="p-6">
                    <form onSubmit={handleSubmit}>
                        
                        {/* Username Field */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Username</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 font-bold transition-all"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : 'Sign In'}
                        </button>

                    </form>
                </div>
                
            </div>
        </div>
    );
};

export default Login;