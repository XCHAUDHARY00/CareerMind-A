import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Dna, Zap, Map, BookOpen, Briefcase,
  Mic, FolderGit2, GitBranch, FileText, User, Settings,
  ChevronLeft, ChevronRight, HelpCircle, LogOut, Sparkles, X, Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockUser } from '../../data/mockData';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/career-dna', icon: Dna, label: 'Career DNA' },
  { path: '/skill-gaps', icon: Zap, label: 'Skill Gaps' },
  { path: '/roadmap', icon: Map, label: 'Roadmap' },
  { path: '/courses', icon: BookOpen, label: 'Courses' },
  { path: '/jobs', icon: Briefcase, label: 'Jobs' },
  { path: '/mock-interview', icon: Mic, label: 'Mock Interview' },
  { path: '/projects', icon: FolderGit2, label: 'Projects' },
  { path: '/github', icon: GitBranch, label: 'GitHub' },
  { path: '/resume', icon: FileText, label: 'Resume' },
];

const bottomItems = [
  { path: '/profile', icon: User, label: 'Profile' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const Logo = ({ collapsed }) => (
  <div className="flex items-center gap-2.5 overflow-hidden">
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 glow-indigo">
      <Sparkles size={16} className="text-white" />
    </div>
    <AnimatePresence>
      {!collapsed && (
        <motion.span
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 'auto' }}
          exit={{ opacity: 0, width: 0 }}
          transition={{ duration: 0.2 }}
          className="font-bold text-sm text-white whitespace-nowrap overflow-hidden"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          CareerMind <span className="gradient-text">AI</span>
        </motion.span>
      )}
    </AnimatePresence>
  </div>
);

const NavItem = ({ item, collapsed }) => {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
          isActive
            ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'
            : 'text-[#9898b0] hover:text-white hover:bg-white/5 border border-transparent'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={18} className={`flex-shrink-0 transition-colors ${isActive ? 'text-indigo-400' : ''}`} />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-medium whitespace-nowrap overflow-hidden"
              >
                {item.label}
              </motion.span>
            )}
          </AnimatePresence>
          {/* Active dot indicator */}
          {isActive && (
            <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-indigo-400" />
          )}
          {/* Tooltip for collapsed */}
          {collapsed && (
            <div className="absolute left-full ml-3 px-2 py-1 bg-[#1a1a25] border border-[#2a2a38] rounded-lg text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity shadow-xl">
              {item.label}
            </div>
          )}
        </>
      )}
    </NavLink>
  );
};

// Mobile bottom nav
const MobileNav = () => {
  const topItems = navItems.slice(0, 5);
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#1a1a25] glass-strong md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {topItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                  isActive ? 'text-indigo-400' : 'text-[#55556a]'
                }`
              }
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
            </NavLink>
          );
        })}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
              isActive ? 'text-indigo-400' : 'text-[#55556a]'
            }`
          }
        >
          <User size={20} />
          <span className="text-[10px] font-medium">Profile</span>
        </NavLink>
      </div>
    </div>
  );
};

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { logout, user } = useAuth();
  const displayName = user?.user?.username || mockUser.firstName;

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="hidden md:flex flex-col h-screen bg-[#0d0d12] border-r border-[#1a1a25] flex-shrink-0 overflow-hidden relative z-30"
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-[#1a1a25]">
        <Logo collapsed={collapsed} />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-md text-[#55556a] hover:text-white hover:bg-white/5 transition-all"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-2 space-y-1">
        {navItems.map((item) => (
          <NavItem key={item.path} item={item} collapsed={collapsed} />
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-[#1a1a25] mx-4" />

      {/* Bottom items */}
      <div className="py-4 px-2 space-y-1">
        {bottomItems.map((item) => (
          <NavItem key={item.path} item={item} collapsed={collapsed} />
        ))}

        {/* User + Logout */}
        <div className={`mt-2 flex items-center gap-3 px-3 py-2 rounded-xl border border-[#1a1a25] overflow-hidden`}>
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {displayName?.[0]?.toUpperCase() || 'R'}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="flex-1 min-w-0 overflow-hidden"
              >
                <p className="text-xs font-semibold text-white truncate">{displayName}</p>
                <p className="text-[10px] text-[#55556a] truncate">Backend Dev path</p>
              </motion.div>
            )}
          </AnimatePresence>
          {!collapsed && (
            <button
              onClick={logout}
              className="flex-shrink-0 text-[#55556a] hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

// Top header bar for app pages
const AppHeader = ({ title, subtitle }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout, user } = useAuth();
  const displayName = user?.user?.username || mockUser.firstName;

  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a25] glass-strong sticky top-0 z-20">
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            className="md:hidden text-[#9898b0] hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={20} />
          </button>
          <div>
            {title && <h1 className="text-base font-semibold text-white">{title}</h1>}
            {subtitle && <p className="text-xs text-[#55556a]">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
            <span className="text-indigo-400 text-xs font-semibold">XP</span>
            <span className="text-white text-xs font-bold">2,840</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 rounded-lg border border-orange-500/20">
            <span className="text-orange-400 text-sm">🔥</span>
            <span className="text-white text-xs font-bold">7</span>
          </div>
        </div>
      </header>

      {/* Mobile slide-in menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-[#0d0d12] border-r border-[#1a1a25] z-50 flex flex-col"
            >
              <div className="flex items-center justify-between px-4 py-5 border-b border-[#1a1a25]">
                <Logo collapsed={false} />
                <button onClick={() => setMobileMenuOpen(false)} className="text-[#55556a]">
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
                {[...navItems, ...bottomItems].map((item) => (
                  <div key={item.path} onClick={() => setMobileMenuOpen(false)}>
                    <NavItem item={item} collapsed={false} />
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-[#1a1a25]">
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors w-full px-3 py-2 rounded-lg hover:bg-red-500/10"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// Main App Layout wrapper
const AppLayout = ({ children, title, subtitle }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-[#050508] overflow-hidden">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AppHeader title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
};

export { Sidebar, AppHeader, MobileNav, AppLayout };
export default AppLayout;
