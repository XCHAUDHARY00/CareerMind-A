import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Edit2, Save, X, Target, Trash2, Plus, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import AIAssistant from '../components/ai/AIAssistant';
import api from '../api';
import { mockAchievements } from '../data/mockData';

// ─── Toast Notification Component ───────────────────────────────────────────
const Toast = ({ message, type }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 40, scale: 0.9 }}
    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl font-semibold text-sm shadow-2xl border ${
      type === 'success'
        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-emerald-500/20'
        : 'bg-red-500/20 border-red-500/40 text-red-300 shadow-red-500/20'
    }`}
  >
    {type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
    {message}
  </motion.div>
);

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ experience: '', bio: '' });
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  // Toast state
  const [toast, setToast] = useState(null); // { message, type }

  // Skills
  const [newSkill, setNewSkill] = useState('');
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  // Education
  const [isAddingEdu, setIsAddingEdu] = useState(false);
  const [isSavingEdu, setIsSavingEdu] = useState(false);
  const [deletingEduId, setDeletingEduId] = useState(null);
  const [eduForm, setEduForm] = useState({ course: '', institution: '', start_date: '', end_date: '' });

  // Goals
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [isSavingGoal, setIsSavingGoal] = useState(false);
  const [deletingGoalId, setDeletingGoalId] = useState(null);
  const [goalForm, setGoalForm] = useState({ title: '', description: '', target_date: '' });

  // Show toast helper
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    setLoading(true);
    api.get('/myprofile/')
      .then(res => {
        if (res.data?.data) {
          const p = res.data.data;
          setProfileData(p);
          setForm({ experience: p.experience || '', bio: p.bio || '' });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  // ── Profile Save ──────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSavingProfile(true);
    try {
      if (profileData?.id) {
        await api.patch(`/updateprofile/${profileData.id}/`, form);
        setProfileData(prev => ({ ...prev, ...form }));
        setIsEditing(false);
        showToast('Profile updated!', 'success');
      }
    } catch {
      showToast('Failed to save profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  // ── Skill Actions ─────────────────────────────────────────────────────────
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
        showToast(`"${skillName}" added!`, 'success');
      }
    } catch {
      showToast('Failed to add skill', 'error');
    } finally {
      setIsAddingSkill(false);
    }
  };

  const handleRemoveSkill = async (skillId, skillName) => {
    try {
      await api.delete(`/removeskill/${skillId}/`);
      setProfileData(prev => ({
        ...prev,
        skills: (prev.skills || []).filter(s => s.id !== skillId)
      }));
      showToast(`"${skillName}" removed`, 'success');
    } catch {
      showToast('Failed to remove skill', 'error');
    }
  };

  // ── Education Actions ─────────────────────────────────────────────────────
  const handleAddEdu = async (e) => {
    e.preventDefault();
    if (!eduForm.course.trim() || !eduForm.institution.trim() || !eduForm.start_date) {
      showToast('Please fill Course, Institution, and Start Date', 'error');
      return;
    }
    setIsSavingEdu(true);

    // Send null for empty end_date (not empty string)
    const payload = {
      course: eduForm.course.trim(),
      institution: eduForm.institution.trim(),
      start_date: eduForm.start_date,
      end_date: eduForm.end_date || null,
    };

    try {
      const res = await api.post('/addeducation/', payload);
      if (res.data?.status === 'success' && res.data?.data) {
        // Append ONLY the new item to local state — NO page reload
        setProfileData(prev => ({
          ...prev,
          user_educations: [...(prev.user_educations || []), res.data.data]
        }));
        setEduForm({ course: '', institution: '', start_date: '', end_date: '' });
        setIsAddingEdu(false);
        showToast('Education saved!', 'success');
      } else {
        showToast('Could not save education', 'error');
      }
    } catch (err) {
      console.error('Education save error:', err?.response?.data || err.message);
      showToast('Error saving education', 'error');
    } finally {
      setIsSavingEdu(false);
    }
  };

  const handleDeleteEdu = async (eduId) => {
    setDeletingEduId(eduId);
    try {
      await api.delete(`/education/${eduId}/`);
      // Remove from local state — NO page reload
      setProfileData(prev => ({
        ...prev,
        user_educations: (prev.user_educations || []).filter(e => e.id !== eduId)
      }));
      showToast('Education removed', 'success');
    } catch {
      showToast('Failed to delete education', 'error');
    } finally {
      setDeletingEduId(null);
    }
  };

  // ── Goal Actions ──────────────────────────────────────────────────────────
  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!goalForm.title.trim() || !goalForm.description.trim()) {
      showToast('Please fill Role Title and Description', 'error');
      return;
    }
    setIsSavingGoal(true);
    try {
      const res = await api.post('/addcarrergoal/', {
        title: goalForm.title.trim(),
        description: goalForm.description.trim(),
        target_date: goalForm.target_date || null,
      });
      if (res.data?.data) {
        setProfileData(prev => ({
          ...prev,
          user_career_goals: [...(prev.user_career_goals || []), res.data.data]
        }));
        setGoalForm({ title: '', description: '', target_date: '' });
        setIsAddingGoal(false);
        showToast('Career goal added!', 'success');
      }
    } catch {
      showToast('Failed to add career goal', 'error');
    } finally {
      setIsSavingGoal(false);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    setDeletingGoalId(goalId);
    try {
      await api.delete(`/careergoal/${goalId}/`);
      setProfileData(prev => ({
        ...prev,
        user_career_goals: (prev.user_career_goals || []).filter(g => g.id !== goalId)
      }));
      showToast('Goal removed', 'success');
    } catch {
      showToast('Failed to delete goal', 'error');
    } finally {
      setDeletingGoalId(null);
    }
  };

  const displayName = profileData?.user?.username || 'there';
  const targetRole = profileData?.user_career_goals?.length
    ? profileData.user_career_goals[profileData.user_career_goals.length - 1].title
    : 'Software Developer';

  if (loading) {
    return (
      <AppLayout title="Profile" subtitle="Your career profile">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <Loader2 size={28} className="animate-spin text-indigo-400" />
          <p className="text-xs text-[#55556a]">Loading your profile...</p>
        </div>
        <AIAssistant />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Profile" subtitle="Your career profile">
      <div className="p-6 max-w-5xl mx-auto space-y-5">

        {/* ── Profile Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
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
          {/* ── Left Column ── */}
          <div className="md:col-span-2 space-y-4">

            {/* About Me */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-5"
            >
              <h3 className="text-sm font-semibold text-white mb-4">About Me</h3>
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#9898b0] uppercase tracking-wider mb-1.5">Experience</label>
                    <input
                      type="text" value={form.experience}
                      onChange={e => setForm(prev => ({ ...prev, experience: e.target.value }))}
                      className="w-full bg-[#111118] border border-[#1a1a25] rounded-xl px-3 py-2 text-sm text-white placeholder-[#55556a] focus:outline-none focus:border-indigo-500/60 transition-all"
                      placeholder="e.g. 2 years as Frontend Dev"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#9898b0] uppercase tracking-wider mb-1.5">Bio</label>
                    <textarea
                      value={form.bio} onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4} placeholder="Write a brief bio..."
                      className="w-full bg-[#111118] border border-[#1a1a25] rounded-xl px-3 py-2 text-sm text-white placeholder-[#55556a] focus:outline-none focus:border-indigo-500/60 transition-all resize-none"
                    />
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleSave} disabled={savingProfile}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 rounded-xl text-xs font-semibold text-white transition-all"
                    >
                      {savingProfile ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                      {savingProfile ? 'Saving...' : 'Save Changes'}
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
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-5"
            >
              <h3 className="text-sm font-semibold text-white mb-4">Education</h3>

              {/* Existing education items */}
              <div className="space-y-3 mb-3">
                {profileData?.user_educations?.length ? (
                  profileData.user_educations.map(edu => (
                    <div key={edu.id} className="relative group border-l-2 border-indigo-500/40 pl-4 py-1 flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-white">{edu.course}</p>
                        <p className="text-xs text-[#55556a]">{edu.institution}</p>
                        <p className="text-[10px] text-[#3a3a4a] mt-0.5">
                          {edu.start_date} — {edu.end_date || 'Present'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteEdu(edu.id)}
                        disabled={deletingEduId === edu.id}
                        className="text-[#55556a] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:opacity-100"
                        title="Delete education"
                      >
                        {deletingEduId === edu.id
                          ? <Loader2 size={13} className="animate-spin text-red-400" />
                          : <Trash2 size={13} />
                        }
                      </button>
                    </div>
                  ))
                ) : (
                  !isAddingEdu && <p className="text-xs text-[#55556a] italic">No education added yet.</p>
                )}
              </div>

              {/* Add education form */}
              <AnimatePresence>
                {isAddingEdu && (
                  <motion.form
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    onSubmit={handleAddEdu}
                    className="space-y-3 p-4 bg-[#111118] border border-indigo-500/20 rounded-xl"
                  >
                    <div>
                      <label className="block text-[10px] font-semibold text-[#9898b0] uppercase tracking-wider mb-1">Course / Degree *</label>
                      <input
                        type="text" required value={eduForm.course}
                        onChange={e => setEduForm(prev => ({ ...prev, course: e.target.value }))}
                        placeholder="B.Tech Computer Science"
                        className="w-full bg-[#0d0d12] border border-[#1a1a25] rounded-xl px-3 py-1.5 text-xs text-white placeholder-[#55556a] focus:outline-none focus:border-indigo-500/60 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-[#9898b0] uppercase tracking-wider mb-1">Institution *</label>
                      <input
                        type="text" required value={eduForm.institution}
                        onChange={e => setEduForm(prev => ({ ...prev, institution: e.target.value }))}
                        placeholder="IIT Delhi"
                        className="w-full bg-[#0d0d12] border border-[#1a1a25] rounded-xl px-3 py-1.5 text-xs text-white placeholder-[#55556a] focus:outline-none focus:border-indigo-500/60 transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-[#9898b0] uppercase tracking-wider mb-1">Start Date *</label>
                        <input
                          type="date" required value={eduForm.start_date}
                          onChange={e => setEduForm(prev => ({ ...prev, start_date: e.target.value }))}
                          className="w-full bg-[#0d0d12] border border-[#1a1a25] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500/60 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-[#9898b0] uppercase tracking-wider mb-1">End Date (Optional)</label>
                        <input
                          type="date" value={eduForm.end_date}
                          onChange={e => setEduForm(prev => ({ ...prev, end_date: e.target.value }))}
                          className="w-full bg-[#0d0d12] border border-[#1a1a25] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500/60 transition-all"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button type="button" onClick={() => { setIsAddingEdu(false); setEduForm({ course: '', institution: '', start_date: '', end_date: '' }); }}
                        className="px-3 py-1.5 border border-[#2a2a38] rounded-xl text-xs font-semibold text-[#9898b0] hover:text-white transition-all"
                      >
                        Cancel
                      </button>
                      <button type="submit" disabled={isSavingEdu}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 rounded-xl text-xs font-semibold text-white transition-all"
                      >
                        {isSavingEdu ? <><Loader2 size={11} className="animate-spin" /> Saving...</> : <><Plus size={11} /> Save Education</>}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {!isAddingEdu && (
                <button onClick={() => setIsAddingEdu(true)}
                  className="w-full mt-2 flex items-center justify-center gap-1.5 py-2 border border-dashed border-[#2a2a38] rounded-xl text-xs text-[#55556a] hover:text-white hover:border-indigo-500/40 transition-all font-medium"
                >
                  <Plus size={13} /> Add Education
                </button>
              )}
            </motion.div>

            {/* Career Goals */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-5"
            >
              <h3 className="text-sm font-semibold text-white mb-4">Career Goals</h3>

              <div className="space-y-3 mb-3">
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
                        disabled={deletingGoalId === goal.id}
                        className="text-[#55556a] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:opacity-100"
                      >
                        {deletingGoalId === goal.id
                          ? <Loader2 size={13} className="animate-spin text-red-400" />
                          : <Trash2 size={13} />
                        }
                      </button>
                    </div>
                  ))
                ) : (
                  !isAddingGoal && <p className="text-xs text-[#55556a] italic">No goals added yet.</p>
                )}
              </div>

              <AnimatePresence>
                {isAddingGoal && (
                  <motion.form
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    onSubmit={handleAddGoal}
                    className="space-y-3 p-4 bg-[#111118] border border-indigo-500/20 rounded-xl"
                  >
                    <div>
                      <label className="block text-[10px] font-semibold text-[#9898b0] uppercase tracking-wider mb-1">Target Role / Goal Title *</label>
                      <input
                        type="text" required value={goalForm.title}
                        onChange={e => setGoalForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Backend Developer"
                        className="w-full bg-[#0d0d12] border border-[#1a1a25] rounded-xl px-3 py-1.5 text-xs text-white placeholder-[#55556a] focus:outline-none focus:border-indigo-500/60 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-[#9898b0] uppercase tracking-wider mb-1">Description *</label>
                      <textarea
                        required value={goalForm.description}
                        onChange={e => setGoalForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Master Django, PostgreSQL and Docker..."
                        rows={2}
                        className="w-full bg-[#0d0d12] border border-[#1a1a25] rounded-xl px-3 py-1.5 text-xs text-white placeholder-[#55556a] focus:outline-none focus:border-indigo-500/60 transition-all resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-[#9898b0] uppercase tracking-wider mb-1">Target Date (Optional)</label>
                      <input
                        type="date" value={goalForm.target_date}
                        onChange={e => setGoalForm(prev => ({ ...prev, target_date: e.target.value }))}
                        className="w-full bg-[#0d0d12] border border-[#1a1a25] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500/60 transition-all"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button type="button" onClick={() => { setIsAddingGoal(false); setGoalForm({ title: '', description: '', target_date: '' }); }}
                        className="px-3 py-1.5 border border-[#2a2a38] rounded-xl text-xs font-semibold text-[#9898b0] hover:text-white transition-all"
                      >
                        Cancel
                      </button>
                      <button type="submit" disabled={isSavingGoal}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 rounded-xl text-xs font-semibold text-white transition-all"
                      >
                        {isSavingGoal ? <><Loader2 size={11} className="animate-spin" /> Saving...</> : <><Plus size={11} /> Save Goal</>}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {!isAddingGoal && (
                <button onClick={() => setIsAddingGoal(true)}
                  className="w-full mt-2 flex items-center justify-center gap-1.5 py-2 border border-dashed border-[#2a2a38] rounded-xl text-xs text-[#55556a] hover:text-white hover:border-indigo-500/40 transition-all font-medium"
                >
                  <Plus size={13} /> Add Career Goal
                </button>
              )}
            </motion.div>
          </div>

          {/* ── Right Column ── */}
          <div className="space-y-4">

            {/* Skills */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-5"
            >
              <h3 className="text-sm font-semibold text-white mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {(profileData?.skills || []).map((skill, i) => (
                  <span key={skill.id || i} className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/15 border border-indigo-500/25 rounded-lg text-[11px] text-indigo-300 font-medium">
                    {skill.name}
                    <button onClick={() => handleRemoveSkill(skill.id, skill.name)} className="text-indigo-400 hover:text-red-400 transition-colors">
                      <X size={10} />
                    </button>
                  </span>
                ))}
                {(!profileData?.skills || profileData.skills.length === 0) && (
                  <p className="text-xs text-[#55556a]">No skills added yet.</p>
                )}
              </div>
              <form onSubmit={handleAddSkill} className="flex gap-2 mt-4">
                <input
                  type="text" required value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  placeholder="e.g. React"
                  className="flex-1 bg-[#111118] border border-[#1a1a25] rounded-xl px-3 py-1.5 text-xs text-white placeholder-[#55556a] focus:outline-none focus:border-indigo-500/60 transition-all"
                />
                <button type="submit" disabled={isAddingSkill}
                  className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 rounded-xl text-xs font-semibold text-white transition-all flex items-center gap-1"
                >
                  {isAddingSkill ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />} Add
                </button>
              </form>
            </motion.div>

            {/* Career Stats */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
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
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
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

      {/* Global Toast Notification */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} />}
      </AnimatePresence>

      <AIAssistant />
    </AppLayout>
  );
};

export default Profile;
