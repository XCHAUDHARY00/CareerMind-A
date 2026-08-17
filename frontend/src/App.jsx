import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import Landing from './pages/Landing';
import Login from './pages/login';
import Register from './pages/register';
import ForgotPassword from './pages/ForgotPassword';

// Protected pages
import Dashboard from './pages/dashboard';
import CareerDNA from './pages/CareerDNA';
import SkillGaps from './pages/SkillGaps';
import Roadmap from './pages/roadmap';
import Courses from './pages/Courses';
import Jobs from './pages/Jobs';
import MockInterview from './pages/MockInterview';
import Projects from './pages/Projects';
import GitHubPage from './pages/GitHub';
import Resume from './pages/Resume';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Chat from './pages/chat';

// ─── Global React Query client ────────────────────────────────────────────────
// Ek baar banao → poori app mein share hota hai
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,   // 10 min: data fresh maana jaayega
      gcTime:    30 * 60 * 1000,   // 30 min: memory mein rakho (even if unused)
      retry: 1,                     // Fail hone par sirf 1 baar retry
      refetchOnWindowFocus: false,  // Tab switch karne par auto-refetch band
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/career-dna" element={<ProtectedRoute><CareerDNA /></ProtectedRoute>} />
            <Route path="/skill-gaps" element={<ProtectedRoute><SkillGaps /></ProtectedRoute>} />
            <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
            <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
            <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
            <Route path="/mock-interview" element={<ProtectedRoute><MockInterview /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
            <Route path="/github" element={<ProtectedRoute><GitHubPage /></ProtectedRoute>} />
            <Route path="/resume" element={<ProtectedRoute><Resume /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>

      {/* Dev tools — sirf development mein dikhti hai, production mein automatically remove */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
