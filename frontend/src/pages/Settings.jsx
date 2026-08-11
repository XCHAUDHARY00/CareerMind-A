import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, GitBranch, Palette, Trash2, ChevronRight } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import AIAssistant from '../components/ai/AIAssistant';
import { useAuth } from '../context/AuthContext';

const SettingRow = ({ label, description, children }) => (
  <div className="flex items-center justify-between py-4 border-b border-[#0d0d12] last:border-0">
    <div>
      <p className="text-sm text-white font-medium">{label}</p>
      {description && <p className="text-xs text-[#55556a] mt-0.5">{description}</p>}
    </div>
    <div className="ml-4 flex-shrink-0">{children}</div>
  </div>
);

const Toggle = ({ defaultOn = false }) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn(!on)}
      className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${on ? 'bg-indigo-500' : 'bg-[#2a2a38]'}`}
    >
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${on ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
};

const tabs = [
  { id: 'account', icon: User, label: 'Account' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'appearance', icon: Palette, label: 'Appearance' },
  { id: 'connected', icon: GitBranch, label: 'Connected' },
  { id: 'security', icon: Shield, label: 'Security' },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const { logout } = useAuth();

  return (
    <AppLayout title="Settings" subtitle="Manage your account preferences">
      <div className="p-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar tabs */}
          <div className="md:col-span-1">
            <div className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-2 space-y-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${
                      activeTab === tab.id
                        ? 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-300'
                        : 'text-[#55556a] hover:text-white hover:bg-[#111118]'
                    }`}
                  >
                    <Icon size={14} />
                    {tab.label}
                  </button>
                );
              })}
              <div className="h-px bg-[#1a1a25] my-2" />
              <button
                onClick={logout}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 transition-all text-left"
              >
                <Trash2 size={14} />
                Danger Zone
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-5"
            >
              {activeTab === 'account' && (
                <div>
                  <h2 className="text-sm font-semibold text-white mb-5">Account Settings</h2>
                  <div className="space-y-4 mb-5">
                    {[
                      { label: 'Full Name', placeholder: 'Raj Chaudhary', value: 'Raj Chaudhary' },
                      { label: 'Email', placeholder: 'raj@example.com', value: 'raj@careermind.ai', type: 'email' },
                      { label: 'Username', placeholder: 'rajchaudhary', value: 'rajchaudhary' },
                    ].map(field => (
                      <div key={field.label}>
                        <label className="block text-xs font-semibold text-[#9898b0] uppercase tracking-wider mb-1.5">{field.label}</label>
                        <input
                          type={field.type || 'text'}
                          defaultValue={field.value}
                          className="w-full bg-[#111118] border border-[#1a1a25] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/60 transition-all"
                        />
                      </div>
                    ))}
                  </div>
                  <button className="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-xs font-semibold text-white transition-all">
                    Save Changes
                  </button>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-sm font-semibold text-white mb-5">Notification Preferences</h2>
                  <div className="divide-y divide-[#1a1a25]">
                    <SettingRow label="Daily Learning Reminder" description="Get reminded to complete your daily tasks">
                      <Toggle defaultOn={true} />
                    </SettingRow>
                    <SettingRow label="AI Career Insights" description="Weekly AI analysis of your progress">
                      <Toggle defaultOn={true} />
                    </SettingRow>
                    <SettingRow label="Job Match Alerts" description="Notify when new jobs match your profile">
                      <Toggle defaultOn={false} />
                    </SettingRow>
                    <SettingRow label="Streak Reminders" description="Don't break your learning streak">
                      <Toggle defaultOn={true} />
                    </SettingRow>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div>
                  <h2 className="text-sm font-semibold text-white mb-5">Appearance</h2>
                  <div className="divide-y divide-[#1a1a25]">
                    <SettingRow label="Theme" description="CareerMind AI always looks premium in dark mode">
                      <div className="px-3 py-1.5 bg-[#111118] border border-[#2a2a38] rounded-lg text-xs text-[#9898b0]">
                        Dark Mode (Always)
                      </div>
                    </SettingRow>
                    <SettingRow label="Reduce Animations" description="Turn off entrance animations">
                      <Toggle defaultOn={false} />
                    </SettingRow>
                    <SettingRow label="Compact Sidebar" description="Start with collapsed sidebar">
                      <Toggle defaultOn={false} />
                    </SettingRow>
                  </div>
                </div>
              )}

              {activeTab === 'connected' && (
                <div>
                  <h2 className="text-sm font-semibold text-white mb-5">Connected Accounts</h2>
                  <div className="divide-y divide-[#1a1a25]">
                    {[
                      { name: 'GitHub', icon: GitBranch, connected: true, handle: '@rajchaudhary' },
                      { name: 'LinkedIn', icon: User, connected: false },
                      { name: 'Google', icon: User, connected: false },
                    ].map(account => (
                      <SettingRow key={account.name} label={account.name} description={account.connected ? account.handle : 'Not connected'}>
                        <button className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          account.connected
                            ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                            : 'border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10'
                        }`}>
                          {account.connected ? 'Disconnect' : 'Connect'}
                        </button>
                      </SettingRow>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h2 className="text-sm font-semibold text-white mb-5">Security</h2>
                  <div className="divide-y divide-[#1a1a25]">
                    <SettingRow label="Change Password" description="Last changed 30 days ago">
                      <button className="flex items-center gap-1 px-3 py-1.5 border border-[#2a2a38] rounded-xl text-xs text-[#9898b0] hover:text-white hover:border-[#3a3a48] transition-all">
                        Change <ChevronRight size={12} />
                      </button>
                    </SettingRow>
                    <SettingRow label="Two-Factor Authentication" description="Add an extra layer of security">
                      <Toggle defaultOn={false} />
                    </SettingRow>
                    <SettingRow label="Active Sessions" description="1 active session">
                      <button className="text-xs text-amber-400 hover:text-amber-300 transition-colors">View</button>
                    </SettingRow>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Danger zone */}
            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-500/8 border border-red-500/20 rounded-2xl p-5 mt-5"
              >
                <h3 className="text-sm font-semibold text-red-400 mb-3">Danger Zone</h3>
                <p className="text-xs text-[#55556a] mb-4">Once you delete your account, all your data will be permanently removed. This action cannot be undone.</p>
                <button className="px-4 py-2 border border-red-500/40 text-red-400 hover:bg-red-500/15 rounded-xl text-xs font-semibold transition-all">
                  Delete Account
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <AIAssistant />
    </AppLayout>
  );
};

export default Settings;
