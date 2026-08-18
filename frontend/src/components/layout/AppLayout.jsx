import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Dna, Zap, Map, BookOpen, Briefcase,
  Mic, FolderGit2, GitBranch, FileText, User, Settings,
  ChevronLeft, ChevronRight, HelpCircle, LogOut, Sparkles, X, Menu,
  Sun, Moon, Swords
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/career-dna', icon: Dna, label: 'Career DNA' },
  { path: '/skill-gaps', icon: Zap, label: 'Skill Gaps' },
  { path: '/roadmap', icon: Map, label: 'Roadmap' },
  { path: '/battle', icon: Swords, label: '1v1 Battle' },
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
    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-600 to-teal-400 flex items-center justify-center flex-shrink-0 glow-indigo shadow-lg">
      <Sparkles size={16} className="text-white" />
    </div>
    <AnimatePresence>
      {!collapsed && (
        <motion.span
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 'auto' }}
          exit={{ opacity: 0, width: 0 }}
          transition={{ duration: 0.2 }}
          className="font-bold text-sm whitespace-nowrap overflow-hidden"
          style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-primary)' }}
        >
          SkillForge <span className="gradient-text">AI</span>
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
            ? 'bg-indigo-500/15 border border-indigo-500/25'
            : 'border border-transparent'
        }`
      }
      style={({ isActive }) => ({
        color: isActive ? 'var(--accent-indigo)' : 'var(--text-secondary)',
      })}
    >
      {({ isActive }) => (
        <>
          <Icon size={18} className="flex-shrink-0 transition-colors" />
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
          {/* Active indicator */}
          {isActive && (
            <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-indigo-400" />
          )}
          {/* Tooltip for collapsed */}
          {collapsed && (
            <div
              className="absolute left-full ml-3 px-2 py-1 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity shadow-xl border"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--bg-card-border)', color: 'var(--text-primary)' }}
            >
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
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t md:hidden"
      style={{ background: 'var(--header-bg)', borderColor: 'var(--sidebar-border)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {topItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all`
              }
              style={({ isActive }) => ({
                color: isActive ? 'var(--accent-indigo)' : 'var(--text-muted)',
              })}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
            </NavLink>
          );
        })}
        <NavLink
          to="/profile"
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all"
          style={({ isActive }) => ({
            color: isActive ? 'var(--accent-indigo)' : 'var(--text-muted)',
          })}
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
  const displayName = user?.user?.username || user?.username || 'User';

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--sidebar-border)' }}
      className="hidden md:flex flex-col h-screen border-r flex-shrink-0 overflow-hidden relative z-30"
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b" style={{ borderColor: 'var(--sidebar-border)' }}>
        <Logo collapsed={collapsed} />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-md transition-all"
          style={{ color: 'var(--text-muted)' }}
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
      <div className="h-px mx-4" style={{ background: 'var(--sidebar-border)' }} />

      {/* Bottom items */}
      <div className="py-4 px-2 space-y-1">
        {bottomItems.map((item) => (
          <NavItem key={item.path} item={item} collapsed={collapsed} />
        ))}

        {/* User + Logout */}
        <div className={`mt-2 flex items-center gap-3 px-3 py-2 rounded-xl border overflow-hidden`} style={{ borderColor: 'var(--sidebar-border)' }}>
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {displayName?.[0]?.toUpperCase() || 'U'}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="flex-1 min-w-0 overflow-hidden"
              >
                <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{displayName}</p>
                <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>Backend Dev path</p>
              </motion.div>
            )}
          </AnimatePresence>
          {!collapsed && (
            <button
              onClick={logout}
              className="flex-shrink-0 hover:text-red-400 transition-colors"
              style={{ color: 'var(--text-muted)' }}
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
  const { theme, toggleTheme } = useTheme();
  const displayName = user?.user?.username || user?.username || 'User';

  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 border-b sticky top-0 z-20"
        style={{ background: 'var(--header-bg)', borderColor: 'var(--sidebar-border)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)' }}
      >
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            className="md:hidden transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={20} />
          </button>
          <div>
            {title && <h1 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h1>}
            {subtitle && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Real Career XP */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
            <span className="text-indigo-400 text-xs font-semibold">XP</span>
            <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
              {((user?.career_xp || user?.data?.career_xp || 250)).toLocaleString()}
            </span>
          </div>

          {/* Real Learning / GitHub Streak */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 rounded-lg border border-orange-500/20" title={user?.github_username ? "GitHub Contribution Streak" : "Learning Streak"}>
            <span className="text-orange-400 text-sm">🔥</span>
            <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
              {user?.streak || user?.data?.streak || 1}d
            </span>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            id="theme-toggle-btn"
            className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all hover:scale-105"
            style={{ borderColor: 'var(--bg-card-border)', background: 'var(--bg-card)', color: 'var(--text-secondary)' }}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
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
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AppHeader title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-y-auto pb-20 md:pb-6" style={{ background: 'var(--bg-primary)' }}>
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
};

export { Sidebar, AppHeader, MobileNav, AppLayout };
export default AppLayout;
