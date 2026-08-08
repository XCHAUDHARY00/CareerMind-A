import React, { useState } from 'react';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    // 1. Bhai, yahan apne state variables ban gaye hain
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // React Router ka navigation tool
    const navigate = useNavigate();

    // 2. Is function ke andar TUJHE apna logic likhna hai!
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Base URL .env se aayega, humein sirf '/register/' likhna hai
            const response = await api.post('/register/', {
                username: username,
                email: email,
                password: password
            });

            alert("Success! Response:", response.data);

            // Asli success message aur redirect
            alert("Account Created Successfully! Please login.");
            navigate('/login'); // Seedha login page pe bhej do

        } catch (error) {
            console.error("Registration failed:", error);
            alert("Registration failed!");
        } finally {
            setIsLoading(false);
        }
    };

    // UI Design (Ye maine bana diya hai tere liye)
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-md w-full">

                {/* Header */}
                <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6">
                    <h2 className="text-white text-2xl font-bold text-center">Create Account</h2>
                    <p className="text-green-100 text-center mt-1">Join CareerMind AI today!</p>
                </div>

                {/* Form */}
                <div className="p-6">
                    <form onSubmit={handleSubmit}>

                        {/* Username Field */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Username</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Choose a username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        {/* Email Field */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                            <input
                                type="email"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="raj@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:opacity-90 font-bold transition-all"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-green-600 font-bold hover:underline">
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Register;
