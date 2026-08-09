import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function Roadmap() {
    const [roadmapData, setRoadmapData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const generateRoadmap = async () => {
        setLoading(true);
        setError(null);
        setRoadmapData(null);
        try {
            const response = await api.get('/roadmap/');
            console.log("Roadmap Data:", response.data);
            setRoadmapData(response.data.data.roadmap);
        } catch (err) {
            console.error(err);
            setError("Failed to generate roadmap. Please check your AI API key or try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0a192f] to-slate-900 font-sans text-slate-300">
            
            <main className="max-w-4xl mx-auto px-6 py-12">
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="mb-8 flex items-center text-teal-400 hover:text-teal-300 transition-colors font-medium group"
                >
                    <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Back to Dashboard
                </button>
                
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300 tracking-tight mb-4">
                        AI Career Roadmap
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Let CareerMind AI analyze your profile and chart out your path to success.
                    </p>
                </div>

                {!roadmapData && !loading && (
                    <div className="flex flex-col items-center justify-center p-12 bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700 shadow-2xl">
                        <div className="text-6xl mb-6">🤖</div>
                        <h2 className="text-2xl font-bold text-white mb-2">Ready to unlock your potential?</h2>
                        <p className="text-slate-400 mb-8 text-center max-w-md">
                            We will analyze your current skills, experience, and career goals to generate a personalized step-by-step roadmap.
                        </p>
                        <button 
                            onClick={generateRoadmap}
                            className="px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold rounded-full shadow-[0_0_20px_rgba(20,184,166,0.4)] hover:shadow-[0_0_30px_rgba(20,184,166,0.6)] hover:-translate-y-1 transition-all duration-300"
                        >
                            ✨ Generate My Roadmap
                        </button>
                    </div>
                )}

                {loading && (
                    <div className="flex flex-col items-center justify-center p-20 space-y-6">
                        <div className="relative w-24 h-24">
                            <div className="absolute inset-0 rounded-full border-t-4 border-teal-500 animate-spin"></div>
                            <div className="absolute inset-2 rounded-full border-r-4 border-emerald-400 animate-spin-reverse"></div>
                            <div className="absolute inset-4 rounded-full border-b-4 border-cyan-400 animate-spin"></div>
                        </div>
                        <p className="text-xl text-teal-400 font-medium animate-pulse">AI is analyzing your profile...</p>
                        <p className="text-slate-500 text-sm">This might take a few seconds</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-6 rounded-xl flex items-center space-x-4">
                        <svg className="w-8 h-8 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <div>
                            <h3 className="font-bold text-lg">Error</h3>
                            <p>{error}</p>
                        </div>
                        <button 
                            onClick={generateRoadmap}
                            className="ml-auto px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {roadmapData && (
                    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
                        {roadmapData.map((step, index) => (
                            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                {/* Timeline Dot */}
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.5)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform duration-300 group-hover:scale-110">
                                    <span className="text-slate-900 font-bold">{step.step}</span>
                                </div>
                                
                                {/* Card */}
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-slate-800/60 backdrop-blur-md border border-slate-700 shadow-xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:-translate-y-1 transition-all duration-300">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-bold text-xl text-white">{step.title}</h3>
                                        {step.estimated_time && (
                                            <span className="bg-teal-500/20 text-teal-300 text-xs px-3 py-1 rounded-full font-semibold border border-teal-500/30 whitespace-nowrap">
                                                ⏱ {step.estimated_time}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-slate-300 mb-4">{step.description}</p>
                                    
                                    {step.resources && step.resources.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-slate-700/50">
                                            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Recommended Resources</h4>
                                            <ul className="space-y-2">
                                                {step.resources.map((res, i) => (
                                                    <li key={i} className="flex items-start">
                                                        <span className="text-teal-500 mr-2">▹</span>
                                                        <span className="text-slate-300 text-sm">{res}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Roadmap;
