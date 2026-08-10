import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Dashboard = () => {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Editing States
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editForm, setEditForm] = useState({ experience: '', bio: '' });

    // Add Skill State
    const [newSkill, setNewSkill] = useState('');

    // Education State
    const [isAddingEdu, setIsAddingEdu] = useState(false);
    const [editingEduId, setEditingEduId] = useState(null);
    const [eduForm, setEduForm] = useState({ course: '', institution: '', start_date: '', end_date: '' });

    // Goal State
    const [isAddingGoal, setIsAddingGoal] = useState(false);
    const [editingGoalId, setEditingGoalId] = useState(null);
    const [goalForm, setGoalForm] = useState({ title: '', description: '', target_date: '' });

    const fetchProfile = async () => {
        try {
            const response = await api.get('/myprofile/');
            setProfileData(response.data.data);
            setEditForm({
                experience: response.data.data.experience || '',
                bio: response.data.data.bio || ''
            });
        } catch (err) {
            console.error("Error fetching profile:", err);
            if (err.response && err.response.status === 404) {
                setProfileData(null);
            } else {
                setError("Failed to load profile. Please try again later.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    // --- Profile Update ---
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`/updateprofile/${profileData.id}/`, editForm);
            setIsEditingProfile(false);
            fetchProfile(); // Refresh
        } catch (err) {
            alert("Failed to update profile");
        }
    };

    // --- Skill Handlers ---
    const handleAddSkill = async (e) => {
        e.preventDefault();
        if (!newSkill.trim()) return;
        try {
            await api.post('/addskills/', { name: newSkill });
            setNewSkill('');
            fetchProfile(); // Refresh
        } catch (err) {
            alert("Failed to add skill");
        }
    };

    const handleRemoveSkill = async (skillId) => {
        if (!window.confirm("Remove this skill?")) return;
        try {
            await api.delete(`/removeskill/${skillId}/`);
            fetchProfile();
        } catch (err) {
            alert("Failed to remove skill");
        }
    };

    // --- Education Handlers ---
    const handleAddEducation = async (e) => {
        e.preventDefault();
        try {
            await api.post('/addeducation/', eduForm);
            setIsAddingEdu(false);
            setEduForm({ course: '', institution: '', start_date: '', end_date: '' });
            fetchProfile(); // Refresh
        } catch (err) {
            alert("Failed to add education");
        }
    };

    const handleUpdateEducation = async (e, eduId) => {
        e.preventDefault();
        try {
            await api.put(`/education/${eduId}/`, eduForm);
            setEditingEduId(null);
            setEduForm({ course: '', institution: '', start_date: '', end_date: '' });
            fetchProfile(); // Refresh
        } catch (err) {
            alert("Failed to update education");
        }
    };

    const handleDeleteEducation = async (eduId) => {
        if (!window.confirm("Delete this education entry?")) return;
        try {
            await api.delete(`/education/${eduId}/`);
            fetchProfile();
        } catch (err) {
            alert("Failed to delete education");
        }
    };

    const startEditingEdu = (edu) => {
        setIsAddingEdu(false);
        setEditingEduId(edu.id);
        setEduForm({
            course: edu.course,
            institution: edu.institution,
            start_date: edu.start_date || '',
            end_date: edu.end_date || ''
        });
    };

    // --- Career Goal Handlers ---
    const handleAddGoal = async (e) => {
        e.preventDefault();
        try {
            await api.post('/addcarrergoal/', goalForm);
            setIsAddingGoal(false);
            setGoalForm({ title: '', description: '', target_date: '' });
            fetchProfile(); // Refresh
        } catch (err) {
            alert("Failed to add career goal");
        }
    };

    const handleUpdateGoal = async (e, goalId) => {
        e.preventDefault();
        try {
            await api.put(`/careergoal/${goalId}/`, goalForm);
            setEditingGoalId(null);
            setGoalForm({ title: '', description: '', target_date: '' });
            fetchProfile(); // Refresh
        } catch (err) {
            alert("Failed to update career goal");
        }
    };

    const handleDeleteGoal = async (goalId) => {
        if (!window.confirm("Delete this career goal?")) return;
        try {
            await api.delete(`/careergoal/${goalId}/`);
            fetchProfile();
        } catch (err) {
            alert("Failed to delete career goal");
        }
    };

    const startEditingGoal = (goal) => {
        setIsAddingGoal(false);
        setEditingGoalId(goal.id);
        setGoalForm({
            title: goal.title,
            description: goal.description,
            target_date: goal.target_date || ''
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 flex flex-col md:flex-row justify-between items-center bg-opacity-90 backdrop-blur-sm border border-white">
                    <div>
                        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                            CareerMind AI
                        </h1>
                        <p className="text-gray-500 mt-1">Your Personal Career Control Center</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex gap-4">
                        <button 
                            onClick={() => navigate('/chat')}
                            className="bg-gradient-to-r from-purple-500 to-indigo-650 hover:from-purple-600 hover:to-indigo-705 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] flex items-center gap-1.5"
                        >
                            💬 AI Career Coach
                        </button>
                        <button 
                            onClick={() => navigate('/roadmap')}
                            className="bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-500 hover:to-emerald-600 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(20,184,166,0.3)] hover:shadow-[0_0_25px_rgba(20,184,166,0.5)]"
                        >
                            ✨ AI Roadmap
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 px-6 rounded-full transition-all duration-300 shadow-sm hover:shadow"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {!profileData ? (
                    <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
                        <div className="text-5xl mb-4">🚀</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome aboard!</h2>
                        <p className="text-gray-600 mb-6">Your profile is currently empty. Start building your career journey.</p>
                        <button 
                            onClick={() => fetchProfile()}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 transition"
                        >
                            Refresh Profile
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Left Column (Main Profile & Skills) */}
                        <div className="lg:col-span-1 space-y-6">
                            
                            {/* Profile Card */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-indigo-500">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-gray-800">About Me</h2>
                                    <button 
                                        onClick={() => setIsEditingProfile(!isEditingProfile)}
                                        className="text-indigo-600 text-sm font-medium hover:underline"
                                    >
                                        {isEditingProfile ? 'Cancel' : 'Edit'}
                                    </button>
                                </div>

                                {isEditingProfile ? (
                                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Experience</label>
                                            <input 
                                                type="text" 
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                                value={editForm.experience}
                                                onChange={e => setEditForm({...editForm, experience: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Bio</label>
                                            <textarea 
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm h-24 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                                value={editForm.bio}
                                                onChange={e => setEditForm({...editForm, bio: e.target.value})}
                                            />
                                        </div>
                                        <button type="submit" className="w-full bg-indigo-600 text-white rounded-lg py-2 text-sm font-bold hover:bg-indigo-700 transition">
                                            Save Changes
                                        </button>
                                    </form>
                                ) : (
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase">Experience</p>
                                            <p className="text-gray-800 mt-1">{profileData.experience || <span className="text-gray-400 italic">No experience added</span>}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase">Bio</p>
                                            <p className="text-gray-800 mt-1">{profileData.bio || <span className="text-gray-400 italic">No bio added</span>}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Skills Card */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-purple-500">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Skills</h2>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {profileData.skills && profileData.skills.length > 0 ? (
                                        profileData.skills.map((skill, idx) => (
                                            <span key={idx} className="flex items-center bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm group">
                                                {skill.name}
                                                <button 
                                                    onClick={() => handleRemoveSkill(skill.id)}
                                                    className="ml-2 text-purple-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Remove skill"
                                                >
                                                    ✖
                                                </button>
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-400 italic">No skills added yet.</p>
                                    )}
                                </div>
                                <form onSubmit={handleAddSkill} className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="Add a skill..." 
                                        className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                                        value={newSkill}
                                        onChange={e => setNewSkill(e.target.value)}
                                    />
                                    <button type="submit" className="bg-purple-600 text-white rounded-lg px-4 py-2 text-sm font-bold hover:bg-purple-700 transition">
                                        Add
                                    </button>
                                </form>
                            </div>

                        </div>

                        {/* Right Column (Education & Goals) */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* Education Section */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-800">Education Journey</h2>
                                    <button 
                                        onClick={() => { setIsAddingEdu(!isAddingEdu); setEditingEduId(null); setEduForm({ course: '', institution: '', start_date: '', end_date: '' }); }}
                                        className="text-indigo-600 text-sm font-medium bg-indigo-50 px-4 py-2 rounded-full hover:bg-indigo-100 transition"
                                    >
                                        {isAddingEdu ? 'Cancel' : '+ Add Education'}
                                    </button>
                                </div>

                                {isAddingEdu && (
                                    <form onSubmit={handleAddEducation} className="bg-indigo-50 rounded-xl p-5 mb-6 space-y-4 border border-indigo-100">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Course / Degree</label>
                                                <input required type="text" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none" value={eduForm.course} onChange={e => setEduForm({...eduForm, course: e.target.value})} />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Institution</label>
                                                <input required type="text" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none" value={eduForm.institution} onChange={e => setEduForm({...eduForm, institution: e.target.value})} />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Start Date</label>
                                                <input required type="date" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none" value={eduForm.start_date} onChange={e => setEduForm({...eduForm, start_date: e.target.value})} />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">End Date</label>
                                                <input type="date" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none" value={eduForm.end_date} onChange={e => setEduForm({...eduForm, end_date: e.target.value})} />
                                            </div>
                                        </div>
                                        <button type="submit" className="bg-indigo-600 text-white rounded-lg px-6 py-2 text-sm font-bold hover:bg-indigo-700 transition">Save Education</button>
                                    </form>
                                )}

                                <div className="space-y-4">
                                    {profileData.user_educations && profileData.user_educations.length > 0 ? (
                                        profileData.user_educations.map((edu) => (
                                            <div key={edu.id} className="border-l-4 border-indigo-500 pl-4 py-2 group relative">
                                                {editingEduId === edu.id ? (
                                                    <form onSubmit={(e) => handleUpdateEducation(e, edu.id)} className="bg-indigo-50/50 rounded-xl p-4 space-y-4 border border-indigo-100">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Course / Degree</label>
                                                                <input required type="text" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none" value={eduForm.course} onChange={e => setEduForm({...eduForm, course: e.target.value})} />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Institution</label>
                                                                <input required type="text" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none" value={eduForm.institution} onChange={e => setEduForm({...eduForm, institution: e.target.value})} />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Start Date</label>
                                                                <input required type="date" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none" value={eduForm.start_date} onChange={e => setEduForm({...eduForm, start_date: e.target.value})} />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">End Date</label>
                                                                <input type="date" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none" value={eduForm.end_date} onChange={e => setEduForm({...eduForm, end_date: e.target.value})} />
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button type="submit" className="bg-indigo-600 text-white rounded-lg px-4 py-1.5 text-sm font-bold hover:bg-indigo-700 transition">Update</button>
                                                            <button type="button" onClick={() => setEditingEduId(null)} className="bg-gray-200 text-gray-700 rounded-lg px-4 py-1.5 text-sm font-bold hover:bg-gray-300 transition">Cancel</button>
                                                        </div>
                                                    </form>
                                                ) : (
                                                    <>
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h3 className="font-bold text-gray-800">{edu.course}</h3>
                                                                <p className="text-gray-600 text-sm">{edu.institution}</p>
                                                                <p className="text-gray-400 text-xs mt-1">{edu.start_date} to {edu.end_date || 'Present'}</p>
                                                            </div>
                                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button onClick={() => startEditingEdu(edu)} className="text-indigo-600 bg-indigo-50 p-1.5 rounded hover:bg-indigo-100 transition" title="Edit">
                                                                    ✏️
                                                                </button>
                                                                <button onClick={() => handleDeleteEducation(edu.id)} className="text-red-600 bg-red-50 p-1.5 rounded hover:bg-red-100 transition" title="Delete">
                                                                    🗑️
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                            <p className="text-gray-500 text-sm">No education details added.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Career Goals Section */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-800">Career Goals</h2>
                                    <button 
                                        onClick={() => { setIsAddingGoal(!isAddingGoal); setEditingGoalId(null); setGoalForm({ title: '', description: '', target_date: '' }); }}
                                        className="text-teal-600 text-sm font-medium bg-teal-50 px-4 py-2 rounded-full hover:bg-teal-100 transition"
                                    >
                                        {isAddingGoal ? 'Cancel' : '+ Add Goal'}
                                    </button>
                                </div>

                                {isAddingGoal && (
                                    <form onSubmit={handleAddGoal} className="bg-teal-50 rounded-xl p-5 mb-6 space-y-4 border border-teal-100">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Goal Title</label>
                                                <input required type="text" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none" value={goalForm.title} onChange={e => setGoalForm({...goalForm, title: e.target.value})} />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Description</label>
                                                <textarea required className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm h-20 focus:ring-2 focus:ring-teal-400 focus:outline-none" value={goalForm.description} onChange={e => setGoalForm({...goalForm, description: e.target.value})} />
                                            </div>
                                            <div className="md:col-span-1">
                                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Target Date</label>
                                                <input required type="date" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none" value={goalForm.target_date} onChange={e => setGoalForm({...goalForm, target_date: e.target.value})} />
                                            </div>
                                        </div>
                                        <button type="submit" className="bg-teal-600 text-white rounded-lg px-6 py-2 text-sm font-bold hover:bg-teal-700 transition">Save Goal</button>
                                    </form>
                                )}

                                <div className="space-y-4">
                                    {profileData.user_career_goals && profileData.user_career_goals.length > 0 ? (
                                        profileData.user_career_goals.map((goal) => (
                                            <div key={goal.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:shadow-md transition group relative">
                                                {editingGoalId === goal.id ? (
                                                    <form onSubmit={(e) => handleUpdateGoal(e, goal.id)} className="space-y-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="md:col-span-2">
                                                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Goal Title</label>
                                                                <input required type="text" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none" value={goalForm.title} onChange={e => setGoalForm({...goalForm, title: e.target.value})} />
                                                            </div>
                                                            <div className="md:col-span-2">
                                                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Description</label>
                                                                <textarea required className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1 text-sm h-20 focus:ring-2 focus:ring-teal-400 focus:outline-none" value={goalForm.description} onChange={e => setGoalForm({...goalForm, description: e.target.value})} />
                                                            </div>
                                                            <div className="md:col-span-1">
                                                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Target Date</label>
                                                                <input required type="date" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none" value={goalForm.target_date} onChange={e => setGoalForm({...goalForm, target_date: e.target.value})} />
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button type="submit" className="bg-teal-600 text-white rounded-lg px-4 py-1.5 text-sm font-bold hover:bg-teal-700 transition">Update</button>
                                                            <button type="button" onClick={() => setEditingGoalId(null)} className="bg-gray-200 text-gray-700 rounded-lg px-4 py-1.5 text-sm font-bold hover:bg-gray-300 transition">Cancel</button>
                                                        </div>
                                                    </form>
                                                ) : (
                                                    <>
                                                        <div className="flex justify-between items-start">
                                                            <h3 className="font-bold text-gray-800">{goal.title}</h3>
                                                            <div className="flex items-center gap-3">
                                                                <span className="bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded font-bold">Target: {goal.target_date}</span>
                                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <button onClick={() => startEditingGoal(goal)} className="text-teal-600 bg-teal-50 p-1.5 rounded hover:bg-teal-100 transition" title="Edit">
                                                                        ✏️
                                                                    </button>
                                                                    <button onClick={() => handleDeleteGoal(goal.id)} className="text-red-600 bg-red-50 p-1.5 rounded hover:bg-red-100 transition" title="Delete">
                                                                        🗑️
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-600 text-sm mt-2">{goal.description}</p>
                                                    </>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                            <p className="text-gray-500 text-sm">No career goals set yet. Aim high!</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
