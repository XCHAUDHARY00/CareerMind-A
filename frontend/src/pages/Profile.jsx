import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Edit2, Save, X, TrendingUp, Target, BookOpen } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import AIAssistant from '../components/ai/AIAssistant';
import api from '../api';
import { mockUser, mockSkills, mockAchievements } from '../data/mockData';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ experience: '', bio: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/myprofile/').then(res => {
      if (res.data?.data) {
        setProfileData(res.data.data);
        setForm({ experience: res.data.data.experience || '', bio: res.data.data.bio || '' });
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

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

  const displayName = profileData?.user?.username || mockUser.name;
  const skills = profileData?.skills || mockSkills;

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
              {displayName[0]?.toUpperCase() || 'R'}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white">{displayName}</h1>
              <p className="text-sm text-[#55556a] mt-0.5">{profileData?.user?.email || 'Backend Developer Path'}</p>
              <div className="flex items-center gap-2 mt-2">
                <Target size={13} className="text-indigo-400" />
                <span className="text-xs text-indigo-400">Targeting: Backend Developer</span>
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
          {/* About */}
          <div className="md:col-span-2 space-y-4">
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
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-xs font-semibold text-white transition-all"
                  >
                    <Save size={13} /> Save Changes
                  </button>
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
              <div className="space-y-3">
                {profileData?.user_educations?.length ? (
                  profileData.user_educations.map(edu => (
                    <div key={edu.id} className="border-l-2 border-indigo-500/40 pl-4 py-1">
                      <p className="text-sm font-medium text-white">{edu.course}</p>
                      <p className="text-xs text-[#55556a]">{edu.institution}</p>
                      <p className="text-[10px] text-[#3a3a4a] mt-0.5">{edu.start_date} — {edu.end_date || 'Present'}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#55556a] italic">No education added. Visit the old Dashboard to add.</p>
                )}
              </div>
            </motion.div>

            {/* Goals */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-5"
            >
              <h3 className="text-sm font-semibold text-white mb-4">Career Goals</h3>
              <div className="space-y-3">
                {profileData?.user_career_goals?.length ? (
                  profileData.user_career_goals.map(goal => (
                    <div key={goal.id} className="p-3 bg-[#111118] border border-[#1a1a25] rounded-xl">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-medium text-white">{goal.title}</p>
                          <p className="text-[10px] text-[#55556a] mt-0.5 leading-relaxed">{goal.description}</p>
                        </div>
                        <span className="text-[10px] text-teal-400 ml-2 whitespace-nowrap">{goal.target_date}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#55556a] italic">No goals added yet.</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-5"
            >
              <h3 className="text-sm font-semibold text-white mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {(profileData?.skills || mockSkills.slice(0, 8)).map((skill, i) => (
                  <span key={skill.id || i} className="px-2.5 py-1 bg-indigo-500/15 border border-indigo-500/25 rounded-lg text-[11px] text-indigo-300 font-medium">
                    {skill.name}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-5"
            >
              <h3 className="text-sm font-semibold text-white mb-4">Career Stats</h3>
              <div className="space-y-3">
                {[
                  { label: 'Readiness Score', value: '78/100', color: '#6366f1' },
                  { label: 'Career XP', value: '2,840', color: '#f59e0b' },
                  { label: 'Learning Streak', value: '7 days 🔥', color: '#f97316' },
                  { label: 'Projects Built', value: '3', color: '#14b8a6' },
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
