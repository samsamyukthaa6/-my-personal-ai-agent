import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Target, Clock, ArrowRight, Compass, Shield } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { currentUser, completeOnboarding } = useAuth();

  const [step, setStep] = useState(1);
  const [mainGoal, setMainGoal] = useState('Launch a new startup and master AI agents');
  const [focusAreas, setFocusAreas] = useState<string[]>(['Engineering', 'Study']);
  const [dailyHours, setDailyHours] = useState(6);
  const [workingStart, setWorkingStart] = useState('09:00');
  const [workingEnd, setWorkingEnd] = useState('17:00');
  const [planningStyle, setPlanningStyle] = useState<'structured' | 'balanced' | 'flexible'>('structured');

  if (!currentUser || currentUser.onboardingCompleted) return null;

  const toggleFocusArea = (area: string) => {
    setFocusAreas(prev =>
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  const handleFinish = () => {
    completeOnboarding({
      mainGoal,
      focusAreas,
      dailyAvailableHours: Number(dailyHours),
      workingHoursStart: workingStart,
      workingHoursEnd: workingEnd,
      planningStyle
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-cyan-500/30 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Personal Setup Wizard ({step}/3)
            </span>
          </div>
          <span className="text-xs font-mono text-slate-500">Welcome, {currentUser.name}</span>
        </div>

        {/* Step 1: Goals & Focus */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <h2 className="text-xl font-bold text-white">What is your primary objective?</h2>
              <p className="text-xs text-slate-400 mt-1">
                NEXA will prioritize your daily tasks, schedule study blocks, and build milestones around this goal.
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">Main Focus / Goal</label>
              <input
                type="text"
                value={mainGoal}
                onChange={(e) => setMainGoal(e.target.value)}
                placeholder="e.g. Master Machine Learning or Launch SaaS MVP"
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-2">
                What areas should NEXA assist you with?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Engineering & Code', 'Exam & Study Mode', 'Health & Fitness', 'Daily Time Blocking', 'Career Strategy', 'Habit Consistency'].map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggleFocusArea(area)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition ${
                      focusAreas.includes(area)
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-300 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 mt-4 transition active:scale-95"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Step 2: Time & Working Hours */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <h2 className="text-xl font-bold text-white">What are your optimal hours?</h2>
              <p className="text-xs text-slate-400 mt-1">
                NEXA schedules demanding cognitive tasks during your energy peaks and sets buffer intervals.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-400">Peak Focus Start</label>
                <input
                  type="time"
                  value={workingStart}
                  onChange={(e) => setWorkingStart(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400">Day Wrap-up Time</label>
                <input
                  type="time"
                  value={workingEnd}
                  onChange={(e) => setWorkingEnd(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">
                Daily Available Focus Time (Hours)
              </label>
              <input
                type="number"
                min={2}
                max={14}
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-300 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 transition active:scale-95"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Planning Style */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <h2 className="text-xl font-bold text-white">Select your planning style</h2>
              <p className="text-xs text-slate-400 mt-1">
                How rigid or dynamic should NEXA organize your daily time blocks?
              </p>
            </div>

            <div className="space-y-2">
              {[
                {
                  id: 'structured',
                  title: 'Structured Time-Blocking',
                  desc: 'Exact timestamps, hard calendar allocations, and strict deadline sequencing.'
                },
                {
                  id: 'balanced',
                  title: 'Balanced Rhythm',
                  desc: 'Morning high-cognitive blocks with flexible afternoon slots and recovery buffers.'
                },
                {
                  id: 'flexible',
                  title: 'Fluid Prioritization',
                  desc: 'Checklist-driven with smart priority ranking rather than rigid hours.'
                }
              ].map((style) => (
                <div
                  key={style.id}
                  onClick={() => setPlanningStyle(style.id as any)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                    planningStyle === style.id
                      ? 'bg-cyan-500/15 border-cyan-500/50 shadow-md'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <h4 className="text-xs font-bold text-white">{style.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{style.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-300 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 transition active:scale-95"
              >
                <span>Initialize NEXA Dashboard</span>
                <Sparkles className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
