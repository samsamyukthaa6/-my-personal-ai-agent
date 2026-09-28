import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Target,
  Clock,
  Brain,
  GraduationCap,
  Flame,
  CheckCircle2,
  Wand2,
  Lock,
  Layers,
  BarChart3
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth }) => {
  const { loginDemo } = useAuth();
  const [testCommand, setTestCommand] = useState('Tomorrow at 9 AM remind me to submit my assignment');
  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  const handleTestCommand = () => {
    setTesting(true);
    setTimeout(() => {
      setTestResult({
        actionType: 'create_reminder',
        title: 'Submit Assignment',
        time: '09:00 AM',
        date: 'Tomorrow',
        priority: 'High',
        explanation: 'Parsed natural intent into a structured reminder scheduled for tomorrow at 9:00 AM.'
      });
      setTesting(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-slate-950">
                <Sparkles className="h-5 w-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
                NEXA
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => loginDemo()}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition"
            >
              <Zap className="h-3.5 w-3.5 fill-cyan-400" />
              <span>Try Demo Account</span>
            </button>
            <button
              onClick={() => onOpenAuth('login')}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition"
            >
              Sign In
            </button>
            <button
              onClick={() => onOpenAuth('signup')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-sky-200 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 transition active:scale-95"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 px-6 text-center max-w-5xl mx-auto">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-tr from-cyan-500/15 to-purple-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>POWERED BY GEMINI AI • AUTONOMOUS INTELLIGENCE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            NEXA
            <span className="block mt-2 text-2xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
              Your Personal AI Agent
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed">
            Plan your day. Reach your goals. Get things done. Let AI organize the details, decompose complex projects, and continuously adapt your priorities.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <button
              onClick={() => onOpenAuth('signup')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-sky-200 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 transition active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => loginDemo()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700/80 transition flex items-center justify-center gap-2"
            >
              <Zap className="h-4 w-4 text-cyan-400 fill-cyan-400" />
              <span>Try Live Demo</span>
            </button>
          </div>
        </div>

        {/* Interactive Live Sandbox Preview */}
        <div className="mt-16 max-w-3xl mx-auto rounded-3xl bg-slate-900/80 border border-cyan-500/30 p-6 backdrop-blur-xl shadow-2xl text-left space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Interactive Command Sandbox
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">Natural-Language Intent Parser</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={testCommand}
                onChange={(e) => setTestCommand(e.target.value)}
                placeholder="Type a natural language instruction..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
              <button
                onClick={handleTestCommand}
                disabled={testing}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition shrink-0"
              >
                {testing ? 'Analyzing...' : 'Parse Command'}
              </button>
            </div>

            {testResult && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 text-xs space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-cyan-300 font-bold">
                  <span>Detected Action: {testResult.actionType}</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Requires User Confirmation</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                  <div className="p-2 rounded bg-slate-900">Title: {testResult.title}</div>
                  <div className="p-2 rounded bg-slate-900">Date: {testResult.date}</div>
                  <div className="p-2 rounded bg-slate-900">Time: {testResult.time}</div>
                  <div className="p-2 rounded bg-slate-900">Priority: {testResult.priority}</div>
                </div>
                <p className="text-slate-400 text-[11px] italic pt-1">
                  "{testResult.explanation}"
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-white/5 space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            Intelligent Operating System
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Beyond a Generic Chatbot. An Active Personal Agent.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            NEXA interconnects your schedule, goals, habits, notes, and focus stamina into a unified execution machine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 backdrop-blur-md space-y-3 hover:border-cyan-500/30 transition">
            <div className="h-10 w-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Smart Daily Planner</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyzes deadlines, high-cognitive focus hours, habits, and commitments to assemble an optimal timed schedule every morning.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 backdrop-blur-md space-y-3 hover:border-purple-500/30 transition">
            <div className="h-10 w-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Target className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Goal Decomposition</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Define bold ambitions. Gemini AI breaks them down into verifiable milestones, timeline schedules, and actionable subtasks.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 backdrop-blur-md space-y-3 hover:border-sky-500/30 transition">
            <div className="h-10 w-10 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <GraduationCap className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">AI Study & Learning Mode</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Personalized syllabus roadmaps, active recall practice quizzes, and automatic weak-topic detection adapted to your exam deadlines.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 backdrop-blur-md space-y-3 hover:border-amber-500/30 transition">
            <div className="h-10 w-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Flame className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Habit & Streak Guard</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Visual consistency grids, weekly cadence tracking, and proactive nudges to protect your momentum before streaks break.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 backdrop-blur-md space-y-3 hover:border-cyan-500/30 transition">
            <div className="h-10 w-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Brain className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">AI Memory & Preferences</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Remembers your preferred working hours, planning rituals, and learning pace without storing sensitive personal data.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 backdrop-blur-md space-y-3 hover:border-purple-500/30 transition">
            <div className="h-10 w-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Safety & Confirmation Cards</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No arbitrary or blind mutations. NEXA formats clear confirmation cards for you to confirm, edit, or cancel before saving.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-500">
        <p>© 2026 NEXA. All rights reserved. Powered by Google Gemini AI.</p>
      </footer>
    </div>
  );
};
