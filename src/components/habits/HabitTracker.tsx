import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Habit, Category } from '../../types';
import {
  Flame,
  Plus,
  Check,
  Calendar,
  Sparkles,
  Trash2,
  TrendingUp,
  Award,
  Zap,
  Play
} from 'lucide-react';

export const HabitTracker: React.FC = () => {
  const { habits, addHabit, updateHabit, deleteHabit, toggleHabitDate, showToast } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<Category>('Health');
  const [newFrequency, setNewFrequency] = useState<'daily' | 'weekdays' | 'weekly'>('daily');
  const [newTargetCount, setNewTargetCount] = useState(1);
  const [newUnit, setNewUnit] = useState('times');
  const [newTimeOfDay, setNewTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'anytime'>('morning');

  // Past 7 days array
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString([], { weekday: 'narrow' }),
      dayNumber: d.getDate(),
      isToday: i === 6
    };
  });

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addHabit({
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      category: newCategory,
      frequency: newFrequency,
      targetCount: Number(newTargetCount),
      unit: newUnit,
      timeOfDay: newTimeOfDay,
      color: '#00d2ff'
    });

    setNewTitle('');
    setNewDescription('');
    setIsAddModalOpen(false);
  };

  const totalCurrentStreak = habits.reduce((acc, h) => acc + h.currentStreak, 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Flame className="h-5 w-5 text-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Consistency Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Habit Tracker & Streak System
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Build unbreakable routines. NEXA guards your streaks and detects high-consistency patterns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5">
            <Zap className="h-4 w-4 fill-amber-400" />
            <span>Cumulative Streak: {totalCurrentStreak} Days</span>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-sky-200 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-cyan-500/20 transition active:scale-95 shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>New Habit</span>
          </button>
        </div>
      </div>

      {/* Habit Cards */}
      <div className="space-y-3.5">
        {habits.map((habit) => {
          const isDoneToday = habit.completedDates.includes(last7Days[6].dateStr);

          return (
            <div
              key={habit.id}
              className="rounded-3xl bg-slate-900/80 border border-slate-800 p-5 backdrop-blur-xl hover:border-slate-700 transition space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left: Info */}
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={() => toggleHabitDate(habit.id, last7Days[6].dateStr)}
                    className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 transition ${
                      isDoneToday
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                    }`}
                    title={isDoneToday ? 'Completed today' : 'Log completion for today'}
                  >
                    {isDoneToday ? <Check className="h-6 w-6 stroke-[3]" /> : <Play className="h-5 w-5 ml-0.5" />}
                  </button>

                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {habit.category}
                      </span>
                      <span className="text-xs text-slate-400 capitalize">
                        {habit.timeOfDay} • {habit.targetCount} {habit.unit}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">
                      {habit.title}
                    </h3>
                    {habit.description && (
                      <p className="text-xs text-slate-400 mt-0.5">{habit.description}</p>
                    )}
                  </div>
                </div>

                {/* Right: Streaks and 7-day grid */}
                <div className="flex items-center justify-between md:justify-end gap-6 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                  {/* Past 7 Days Visual Grid */}
                  <div className="flex items-center gap-1.5">
                    {last7Days.map((d, idx) => {
                      const completed = habit.completedDates.includes(d.dateStr);
                      return (
                        <button
                          key={idx}
                          onClick={() => toggleHabitDate(habit.id, d.dateStr)}
                          className="flex flex-col items-center gap-1 group/day"
                          title={`${d.dateStr}: ${completed ? 'Completed' : 'Missed'}`}
                        >
                          <span className={`text-[10px] font-mono ${d.isToday ? 'text-cyan-400 font-bold' : 'text-slate-500'}`}>
                            {d.dayName}
                          </span>
                          <div
                            className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-mono transition ${
                              completed
                                ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold'
                                : 'bg-slate-950 border border-slate-800 text-slate-600 group-hover/day:border-slate-700'
                            }`}
                          >
                            {completed ? <Check className="h-3.5 w-3.5" /> : d.dayNumber}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Streaks counters */}
                  <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm font-mono font-extrabold text-amber-300">
                        <Flame className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span>{habit.currentStreak}d</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block">Current</span>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs font-mono font-bold text-slate-300">
                        <Award className="h-3.5 w-3.5 text-purple-400" />
                        <span>{habit.longestStreak}d</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block">Best</span>
                    </div>

                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition ml-1"
                      title="Delete habit"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Habit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-white">Create New Habit</h2>
            <form onSubmit={handleCreateHabit} className="space-y-3.5">
              <div>
                <label className="text-xs font-medium text-slate-400">Habit Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Read 20 pages of technical paper"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Uninterrupted flow in quiet room"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-400">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as Category)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Health">Health</option>
                    <option value="Study">Study</option>
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400">Time of Day</label>
                  <select
                    value={newTimeOfDay}
                    onChange={(e) => setNewTimeOfDay(e.target.value as any)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                    <option value="anytime">Anytime</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-400">Target Count</label>
                  <input
                    type="number"
                    min={1}
                    value={newTargetCount}
                    onChange={(e) => setNewTargetCount(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400">Unit</label>
                  <input
                    type="text"
                    placeholder="e.g. pages, mins, ml, session"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-300 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20"
                >
                  Create Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
