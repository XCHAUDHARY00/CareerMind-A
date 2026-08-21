import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Edit2, Save, X, Target, Trash2, Plus, Loader2 } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import AIAssistant from '../components/ai/AIAssistant';
import api from '../api';
import { mockAchievements } from '../data/mockData';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ experience: '', bio: '' });
  const [loading, setLoading] = useState(true);

  // States for interactive inputs
  const [newSkill, setNewSkill] = useState('');
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  const [isAddingEdu, setIsAddingEdu] = useState(false);
  const [eduForm, setEduForm] = useState({ course: '', institution: '', start_date: '', end_date: '' });

  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [goalForm, setGoalForm] = useState({ title: '', description: '', target_date: '' });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    api.get('/myprofile/').then(res => {
      if (res.data?.data) {
        setProfileData(res.data.data);
        setForm({ experience: res.data.data.experience || '', bio: res.data.data.bio || '' });
      }
    }).catch(() => {}).finally(() => setLoading(false));
  };

  const handleSave = async () => {
    try {
      if (profileData?.id) {
        await api.patch(`/updateprofile/${profileData.id}/`, form);
      }
      setIsEditing(false);
      setProfileData(prev => ({ ...prev, ...form }));
    } catch {
      // silently fail for demo
    }
  };

  // Skill actions
  const handleAddSkill = async (e) => {
    e.preventDefault();
    const skillName = newSkill.trim();
    if (!skillName) return;
    setIsAddingSkill(true);
    try {
      const res = await api.post('/addskills/', { name: skillName });
      if (res.data?.data) {
        setProfileData(prev => ({
          ...prev,
          skills: [...(prev.skills || []), res.data.data]
        }));
        setNewSkill('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAddingSkill(false);
    }
  };

  const handleRemoveSkill = async (skillId) => {
    try {
      await api.delete(`/removeskill/${skillId}/`);
      setProfileData(prev => ({
        ...prev,
        skills: (prev.skills || []).filter(s => s.id !== skillId)
      }));
    } catch (err) {
      console.error(err);
    }
  };

  // Education actions
  const handleAddEdu = async (e) => {
    e.preventDefault();
    if (!eduForm.course.trim() || !eduForm.institution.trim() || !eduForm.start_date) return;
    try {
      const res = await api.post('/addeducation/', eduForm);
      if (res.data?.data || res.data?.status === 'success') {
        // Refetch fully from database to prevent duplicate display bugs
        loadProfile();
        setEduForm({ course: '', institution: '', start_date: '', end_date: '' });
        setIsAddingEdu(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEdu = async (eduId) => {
    try {
      await api.delete(`/education/${eduId}/`);
      // Refetch fully from database to prevent state mismatch
      loadProfile();
    } catch (err) {
      console.error(err);
    }
  };

  // Goal actions
  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!goalForm.title.trim() || !goalForm.description.trim()) return;
    try {
      const res = await api.post('/addcarrergoal/', goalForm);
      if (res.data?.data) {
        setProfileData(prev => ({
          ...prev,
          user_career_goals: [...(prev.user_career_goals || []), res.data.data]
        }));
        setGoalForm({ title: '', description: '', target_date: '' });
        setIsAddingGoal(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      await api.delete(`/careergoal/${goalId}/`);
      setProfileData(prev => ({
        ...prev,
        user_career_goals: (prev.user_career_goals || []).filter(g => g.id !== goalId)
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const displayName = profileData?.user?.username || 'there';
  const targetRole = profileData?.user_career_goals?.length 
    ? profileData.user_career_goals[profileData.user_career_goals.length - 1].title 
    : 'Software Developer';

  if (loading) {
    return (
      <AppLayout title="Profile" subtitle="Your career profile">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 size={28} className="animate-spin text-indigo-400" />
        </div>
        <AIAssistant />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Profile" subtitle="Your career profile">
      <div className="p-6 max-w-5xl mx-auto space-y-5">

        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-violet-500/5 pointer-events-none" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-2xl font-bold text-white">
              {displayName[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white">{displayName}</h1>
              <p className="text-sm text-[#55556a] mt-0.5">{profileData?.user?.email || 'No email added'}</p>
              <div className="flex items-center gap-2 mt-2">
                <Target size={13} className="text-indigo-400" />
                <span className="text-xs text-indigo-400">Targeting: {targetRole}</span>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 border border-[#2a2a38] rounded-xl text-xs font-medium text-[#9898b0] hover:text-white hover:border-[#3a3a48] transition-all"
            >
              {isEditing ? <><X size={13} /> Cancel</> : <><Edit2 size={13} /> Edit Profile</>}
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* About & Education & Goals */}
          <div className="md:col-span-2 space-y-4">
            
            {/* About Me */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-5"
            >
              <h3 className="text-sm font-semibold text-white mb-4">About Me</h3>
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#9898b0] uppercase tracking-wider mb-1.5">Experience</label>
                    <input
                      type="text"
                      value={form.experience}
                      onChange={e => setForm(prev => ({ ...prev, experience: e.target.value }))}
                      className="w-full bg-[#111118] border border-[#1a1a25] rounded-xl px-3 py-2 text-sm text-white placeholder-[#55556a] focus:outline-none focus:border-indigo-500/60 transition-all"
                      placeholder="e.g. 2 years as Frontend Dev"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#9898b0] uppercase tracking-wider mb-1.5">Bio</label>
                    <textarea
                      value={form.bio}
                      onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4}
                      className="w-full bg-[#111118] border border-[#1a1a25] rounded-xl px-3 py-2 text-sm text-white placeholder-[#55556a] focus:outline-none focus:border-indigo-500/60 transition-all resize-none"
                      placeholder="Write a brief bio..."
                    />
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-xs font-semibold text-white transition-all"
                    >
                      <Save size={13} /> Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-[#55556a] uppercase tracking-wider font-medium mb-1">Experience</p>
                    <p className="text-sm text-[#9898b0]">{profileData?.experience || 'No experience added yet'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#55556a] uppercase tracking-wider font-medium mb-1">Bio</p>
                    <p className="text-sm text-[#9898b0] leading-relaxed">{profileData?.bio || 'No bio added yet'}</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Education */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-5"
            >
              <h3 className="text-sm font-semibold text-white mb-4">Education</h3>
              {isAddingEdu ? (
                <form onSubmit={handleAddEdu} className="space-y-3 p-4 bg-[#111118] border border-[#1a1a25] rounded-xl">
                  <div>
                    <label className="block text-[10px] font-semibold text-[#9898b0] uppercase tracking-wider mb-1">Course / Degree</label>
                    <input
                      type="text"
                      required
                      value={eduForm.course}
                      onChange={e => setEduForm(prev => ({ ...prev, course: e.target.value }))}
                      placeholder="B.Tech Computer Science"
                      className="w-full bg-[#0d0d12] border border-[#1a1a25] rounded-xl px-3 py-1.5 text-xs text-white placeholder-[#55556a] focus:outline-none focus:border-indigo-500/60 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[#9898b0] uppercase tracking-wider mb-1">Institution</label>
                    <input
                      type="text"
                      required
                      value={eduForm.institution}
                      onChange={e => setEduForm(prev => ({ ...prev, institution: e.target.value }))}
                      placeholder="IIT Delhi"
                      className="w-full bg-[#0d0d12] border border-[#1a1a25] rounded-xl px-3 py-1.5 text-xs text-white placeholder-[#55556a] focus:outline-none focus:border-indigo-500/60 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-[#9898b0] uppercase tracking-wider mb-1">Start Date</label>
                      <input
                        type="date"
                        required
                        value={eduForm.start_date}
                        onChange={e => setEduForm(prev => ({ ...prev, start_date: e.target.value }))}
                        className="w-full bg-[#0d0d12] border border-[#1a1a25] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500/60 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-[#9898b0] uppercase tracking-wider mb-1">End Date (Optional)</label>
                      <input
                        type="date"
                        value={eduForm.end_date}
                        onChange={e => setEduForm(prev => ({ ...prev, end_date: e.target.value }))}
                        className="w-full bg-[#0d0d12] border border-[#1a1a25] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500/60 transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingEdu(false)}
                      className="px-3 py-1.5 border border-[#2a2a38] rounded-xl text-xs font-semibold text-[#9898b0] hover:text-white transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-xs font-semibold text-white transition-all"
                    >
                      Save Education
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="space-y-3">
                    {profileData?.user_educations?.length ? (
                      profileData.user_educations.map(edu => (
                        <div key={edu.id} className="relative group border-l-2 border-indigo-500/40 pl-4 py-1 flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-white">{edu.course}</p>
                            <p className="text-xs text-[#55556a]">{edu.institution}</p>
                            <p className="text-[10px] text-[#3a3a4a] mt-0.5">{edu.start_date} — {edu.end_date || 'Present'}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteEdu(edu.id)}
                            className="text-xs text-[#55556a] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200"
                            title="Delete education"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-[#55556a] italic">No education added yet.</p>
                    )}
                  </div>
                  <button
                    onClick={() => setIsAddingEdu(true)}
                    className="w-full mt-4 flex items-center justify-center gap-1.5 py-2 border border-dashed border-[#2a2a38] rounded-xl text-xs text-[#55556a] hover:text-white hover:border-[#3a3a48] transition-all font-medium"
                  >
                    <Plus size={13} /> Add Education
                  </button>
                </>
              )}
            </motion.div>

            {/* Career Goals */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-5"
            >
              <h3 className="text-sm font-semibold text-white mb-4">Career Goals</h3>
              {isAddingGoal ? (
                <form onSubmit={handleAddGoal} className="space-y-3 p-4 bg-[#111118] border border-[#1a1a25] rounded-xl">
                  <div>
                    <label className="block text-[10px] font-semibold text-[#9898b0] uppercase tracking-wider mb-1">Target Role / Goal Title</label>
                    <input
                      type="text"
                      required
                      value={goalForm.title}
                      onChange={e => setGoalForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Backend Developer"
                      className="w-full bg-[#0d0d12] border border-[#1a1a25] rounded-xl px-3 py-1.5 text-xs text-white placeholder-[#55556a] focus:outline-none focus:border-indigo-500/60 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[#9898b0] uppercase tracking-wider mb-1">Description / Notes</label>
                    <textarea
                      required
                      value={goalForm.description}
                      onChange={e => setGoalForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Master Django, PostgreSQL and Docker to qualify for senior roles."
                      rows={2}
                      className="w-full bg-[#0d0d12] border border-[#1a1a25] rounded-xl px-3 py-1.5 text-xs text-white placeholder-[#55556a] focus:outline-none focus:border-indigo-500/60 transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[#9898b0] uppercase tracking-wider mb-1">Target Date (Optional)</label>
                    <input
                      type="date"
                      value={goalForm.target_date}
                      onChange={e => setGoalForm(prev => ({ ...prev, target_date: e.target.value }))}
                      className="w-full bg-[#0d0d12] border border-[#1a1a25] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500/60 transition-all"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingGoal(false)}
                      className="px-3 py-1.5 border border-[#2a2a38] rounded-xl text-xs font-semibold text-[#9898b0] hover:text-white transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-xs font-semibold text-white transition-all"
                    >
                      Save Goal
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="space-y-3">
                    {profileData?.user_career_goals?.length ? (
                      profileData.user_career_goals.map(goal => (
                        <div key={goal.id} className="relative group p-3 bg-[#111118] border border-[#1a1a25] rounded-xl flex justify-between items-start">
                          <div className="flex-1 mr-4">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-medium text-white">{goal.title}</p>
                              {goal.target_date && <span className="text-[9px] text-teal-400 whitespace-nowrap">{goal.target_date}</span>}
                            </div>
                            <p className="text-[10px] text-[#55556a] mt-0.5 leading-relaxed">{goal.description}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteGoal(goal.id)}
                            className="text-xs text-[#55556a] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200"
                            title="Delete goal"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-[#55556a] italic">No goals added yet.</p>
                    )}
                  </div>
                  <button
                    onClick={() => setIsAddingGoal(true)}
                    className="w-full mt-4 flex items-center justify-center gap-1.5 py-2 border border-dashed border-[#2a2a38] rounded-xl text-xs text-[#55556a] hover:text-white hover:border-[#3a3a48] transition-all font-medium"
                  >
                    <Plus size={13} /> Add Career Goal
                  </button>
                </>
              )}
            </motion.div>
          </div>

          {/* Right column (Skills & Stats & Achievements) */}
          <div className="space-y-4">
            
            {/* Skills Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-5"
            >
              <h3 className="text-sm font-semibold text-white mb-4">Skills</h3>
              
              {/* Skills Tags */}
              <div className="flex flex-wrap gap-2">
                {(profileData?.skills || []).map((skill, i) => (
                  <span key={skill.id || i} className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/15 border border-indigo-500/25 rounded-lg text-[11px] text-indigo-300 font-medium">
                    {skill.name}
                    <button
                      onClick={() => handleRemoveSkill(skill.id)}
                      className="text-indigo-400 hover:text-red-400 transition-colors focus:outline-none"
                      title="Remove skill"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
                {(!profileData?.skills || profileData.skills.length === 0) && (
                  <p className="text-xs text-[#55556a]">No skills added yet.</p>
                )}
              </div>

              {/* Add Skill Form */}
              <form onSubmit={handleAddSkill} className="flex gap-2 mt-4">
                <input
                  type="text"
                  required
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  placeholder="e.g. React"
                  className="flex-1 bg-[#111118] border border-[#1a1a25] rounded-xl px-3 py-1.5 text-xs text-white placeholder-[#55556a] focus:outline-none focus:border-indigo-500/60 transition-all"
                />
                <button
                  type="submit"
                  disabled={isAddingSkill}
                  className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 rounded-xl text-xs font-semibold text-white transition-all flex items-center gap-1"
                >
                  {isAddingSkill ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />} Add
                </button>
              </form>
            </motion.div>

            {/* Career Stats */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-5"
            >
              <h3 className="text-sm font-semibold text-white mb-4">Career Stats</h3>
              <div className="space-y-3">
                {[
                  { label: 'Readiness Score', value: `${profileData?.readiness_score || 50}/100`, color: '#6366f1' },
                  { label: 'Career XP', value: `${(profileData?.career_xp || 250).toLocaleString()} XP`, color: '#8b5cf6' },
                  { label: 'Learning Streak', value: `${profileData?.streak || 1} days 🔥`, color: '#f97316' },
                  { label: 'GitHub Linked', value: profileData?.github_username ? `@${profileData.github_username}` : 'Not linked', color: profileData?.github_username ? '#10b981' : '#9898b0' },
                ].map(stat => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <span className="text-xs text-[#55556a]">{stat.label}</span>
                    <span className="text-sm font-bold" style={{ color: stat.color }}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-5"
            >
              <h3 className="text-sm font-semibold text-white mb-4">Achievements</h3>
              <div className="grid grid-cols-3 gap-2">
                {mockAchievements.map(a => (
                  <div key={a.id} className={`flex flex-col items-center gap-1 p-2 rounded-xl border ${a.earned ? 'bg-[#111118] border-[#1a1a25]' : 'bg-[#0a0a0e] border-[#111118] opacity-40'}`}>
                    <span className="text-lg">{a.icon}</span>
                    <p className="text-[8px] text-[#55556a] text-center leading-tight">{a.title}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <AIAssistant />
    </AppLayout>
  );
};

export default Profile;
