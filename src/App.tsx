import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { Dashboard } from './components/dashboard/Dashboard';
import { TaskManager } from './components/tasks/TaskManager';
import { GoalManager } from './components/goals/GoalManager';
import { DailyPlanner } from './components/planner/DailyPlanner';
import { StudyPlanner } from './components/study/StudyPlanner';
import { HabitTracker } from './components/habits/HabitTracker';
import { CalendarView } from './components/calendar/CalendarView';
import { NotesManager } from './components/notes/NotesManager';
import { AIAssistant } from './components/assistant/AIAssistant';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { MemorySettings } from './components/memory/MemorySettings';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingModal } from './components/auth/OnboardingModal';
import { LandingPage } from './components/landing/LandingPage';
import { CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const { activeTab, toast } = useApp();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#07090e] text-cyan-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center animate-pulse">
            <Sparkles className="h-6 w-6 text-cyan-400" />
          </div>
          <span className="font-mono text-xs uppercase tracking-widest text-slate-400">
            Initializing NEXA Intelligence...
          </span>
        </div>
      </div>
    );
  }

  // If not authenticated, show landing page with Auth Modal
  if (!currentUser) {
    return (
      <>
        <LandingPage
          onOpenAuth={(mode) => {
            setAuthMode(mode);
            setIsAuthModalOpen(true);
          }}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authMode}
        />
      </>
    );
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <TaskManager />;
      case 'goals':
        return <GoalManager />;
      case 'planner':
        return <DailyPlanner />;
      case 'study':
        return <StudyPlanner />;
      case 'habits':
        return <HabitTracker />;
      case 'calendar':
        return <CalendarView />;
      case 'notes':
        return <NotesManager />;
      case 'assistant':
        return <AIAssistant />;
      case 'analytics':
        return <AnalyticsView />;
      case 'memory':
        return <MemorySettings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col antialiased">
      {/* Top Navbar */}
      <Navbar
        onOpenNotifications={() => setIsNotifDrawerOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-none pb-20 md:pb-8">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav onOpenSettings={() => setIsSettingsModalOpen(true)} />

      {/* Modals & Overlays */}
      <NotificationDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
      />

      <GlobalSearchModal />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      <OnboardingModal />

      {/* Toast notifications */}
      {toast && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 border border-cyan-500/40 text-slate-100 text-xs sm:text-sm font-semibold shadow-2xl shadow-cyan-950/60 backdrop-blur-xl">
            {toast.type === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
            {toast.type === 'warning' && <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />}
            {toast.type === 'info' && <Info className="h-4 w-4 text-cyan-400 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainAppContent />
      </AppProvider>
    </AuthProvider>
  );
}
