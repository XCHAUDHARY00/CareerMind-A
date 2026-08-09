import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await api.post('/register/', {
                username,
                email,
                password
            });
            // Registration success, login page par bhej do
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Username might be taken.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 flex-row-reverse">
            {/* Right Side: Branding / Visual (Reversed for variation) */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-500 to-emerald-700 items-center justify-center p-12 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent to-black"></div>
                <div className="relative z-10 max-w-lg text-center">
                    <div className="mb-8 flex justify-center">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-4xl shadow-2xl border border-white/30 transform hover:scale-110 transition duration-500">
                            🌟
                        </div>
                    </div>
                    <h1 className="text-5xl font-extrabold mb-6 tracking-tight leading-tight">
                        Start Your Journey with <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-200 to-teal-100">CareerMind AI</span>
                    </h1>
                    <p className="text-lg text-teal-50 font-medium leading-relaxed">
                        Join thousands of professionals leveling up their careers with AI-powered insights and personalized learning paths.
                    </p>
                </div>
            </div>

            {/* Left Side: Form */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:max-w-md">
                    <div className="text-center lg:text-left mb-10">
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create your account</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-teal-600 hover:text-teal-500 transition-colors">
                                Sign in here
                            </Link>
                        </p>
                    </div>

                    <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl shadow-teal-100/50 rounded-2xl border border-gray-100">
                        {error && (
                            <div className="mb-6 p-4 rounded-lg bg-red-50 border-l-4 border-red-500">
                                <p className="text-sm font-medium text-red-800">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleRegister} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                                <input
                                    type="text"
                                    required
                                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow bg-gray-50/50"
                                    placeholder="johndoe"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Email address</label>
                                <input
                                    type="email"
                                    required
                                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow bg-gray-50/50"
                                    placeholder="john@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow bg-gray-50/50"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Creating account...
                                        </div>
                                    ) : (
                                        'Create Account'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
