import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, Clock, Zap, Star, ChevronRight } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import AIAssistant from '../components/ai/AIAssistant';
import { mockCourses } from '../data/mockData';

const LevelBadge = ({ level }) => {
  const config = {
    Beginner: { color: '#10b981', bg: 'bg-emerald-500/15', border: 'border-emerald-500/25' },
    Intermediate: { color: '#f59e0b', bg: 'bg-amber-500/15', border: 'border-amber-500/25' },
    Advanced: { color: '#ef4444', bg: 'bg-red-500/15', border: 'border-red-500/25' },
  };
  const c = config[level] || config.Beginner;
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${c.bg} ${c.border}`} style={{ color: c.color }}>
      {level}
    </span>
  );
};

const CourseCard = ({ course, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08 }}
    className="bg-[#0d0d12] border border-[#1a1a25] hover:border-[#2a2a38] rounded-2xl p-5 group transition-all hover:-translate-y-0.5 cursor-pointer"
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {course.badge && (
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 uppercase tracking-wider">
              {course.badge}
            </span>
          )}
          <LevelBadge level={course.level} />
        </div>
        <h3 className="text-sm font-semibold text-white leading-snug">{course.title}</h3>
      </div>
      <div className="ml-3 flex flex-col items-center gap-0.5">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
          <span className="text-xs font-bold text-indigo-400">{course.match}%</span>
        </div>
        <span className="text-[9px] text-[#55556a]">match</span>
      </div>
    </div>

    <div className="flex items-center gap-3 text-[10px] text-[#55556a] mb-3">
      <span className="flex items-center gap-1"><Star size={9} className="text-amber-400" />{course.provider}</span>
      <span className="flex items-center gap-1"><Zap size={9} />{course.skill}</span>
      <span className="flex items-center gap-1"><Clock size={9} />{course.duration}</span>
    </div>

    <div className="bg-[#111118] border border-[#1a1a25] rounded-xl p-3 mb-4">
      <p className="text-[10px] text-indigo-400 font-semibold mb-1">Why AI Recommends This</p>
      <p className="text-[11px] text-[#9898b0] leading-relaxed">{course.why}</p>
    </div>

    <a 
      href={course.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 rounded-xl text-xs font-semibold text-white transition-all opacity-0 group-hover:opacity-100"
    >
      Start Course <ExternalLink size={12} />
    </a>
    <a 
      href={course.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-full flex items-center justify-center gap-2 py-2.5 border border-[#2a2a38] rounded-xl text-xs font-semibold text-[#9898b0] hover:text-white hover:border-indigo-500/30 transition-all group-hover:hidden"
    >
      View Course <ChevronRight size={12} />
    </a>
  </motion.div>
);

const Courses = () => {
  const [levelFilter, setLevelFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  const levels = [
    { id: 'all', label: 'All Levels' },
    { id: 'Beginner', label: 'Beginner' },
    { id: 'Intermediate', label: 'Intermediate' },
    { id: 'Advanced', label: 'Advanced' },
  ];

  const types = [
    { id: 'all', label: 'All Types' },
    { id: 'certificate', label: 'Certificates 🎓' },
    { id: 'youtube', label: 'YouTube Free 📺' },
    { id: 'interactive', label: 'Interactive 💻' },
  ];

  const filtered = mockCourses.filter(c => {
    const matchLevel = levelFilter === 'all' || c.level === levelFilter;
    const matchType = typeFilter === 'all' || c.type === typeFilter;
    return matchLevel && matchType;
  });

  return (
    <AppLayout title="Learning Hub" subtitle="Courses selected for your career goals">
      <div className="p-6 max-w-7xl mx-auto">
        {/* AI banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-500/8 border border-indigo-500/20 rounded-2xl p-4 flex items-center gap-3 mb-6"
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
            <BookOpen size={15} className="text-indigo-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-indigo-300">AI-Curated Learning Path</p>
            <p className="text-xs text-[#55556a]">These courses are ordered by their impact on your career readiness score.</p>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {types.map(f => (
              <button
                key={f.id}
                onClick={() => setTypeFilter(f.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  typeFilter === f.id
                    ? 'bg-violet-500/20 border border-violet-500/40 text-violet-300'
                    : 'border border-[#1a1a25] text-[#55556a] hover:text-white hover:border-[#2a2a38]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          
          <div className="w-px bg-[#1a1a25] hidden sm:block" />
          
          <div className="flex gap-2 flex-wrap">
            {levels.map(f => (
              <button
                key={f.id}
                onClick={() => setLevelFilter(f.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  levelFilter === f.id
                    ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300'
                    : 'border border-[#1a1a25] text-[#55556a] hover:text-white hover:border-[#2a2a38]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Course grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length > 0 ? (
            filtered.map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} />
            ))
          ) : (
            <div className="col-span-full py-10 text-center text-[#55556a]">
              <p className="text-sm font-medium">No courses found for these filters.</p>
            </div>
          )}
        </div>
      </div>
      <AIAssistant />
    </AppLayout>
  );
};

export default Courses;
