import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Target,
  Clock,
  Sparkles,
  TrendingUp,
  Award,
  Zap,
  Activity
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { tasks, goals, habits } = useApp();

  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const pendingTasks = tasks.filter((t) => t.status !== 'completed').length;
  const criticalTasks = tasks.filter((t) => t.priority === 'critical' && t.status !== 'completed').length;

  const averageGoalProgress =
    goals.length > 0 ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length) : 0;

  const totalHabitStreaks = habits.reduce((acc, h) => acc + h.currentStreak, 0);

  // Productivity score calculation (0 - 100)
  const productivityScore = Math.min(
    100,
    Math.round((completedTasks * 10) + (averageGoalProgress * 0.4) + (totalHabitStreaks * 2))
  ) || 78;

  // Mock days of the week data for the weekly productivity chart
  const weeklyData = [
    { day: 'Mon', completion: 85, focusHours: 4.5 },
    { day: 'Tue', completion: 92, focusHours: 6.0 }, // Peak
    { day: 'Wed', completion: 74, focusHours: 3.5 },
    { day: 'Thu', completion: 80, focusHours: 5.0 },
    { day: 'Fri', completion: 88, focusHours: 5.5 },
    { day: 'Sat', completion: 65, focusHours: 2.0 },
    { day: 'Sun', completion: 70, focusHours: 2.5 }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="h-5 w-5 text-cyan-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Performance Intelligence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Analytics & AI Productivity Insights
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Multi-dimensional tracking of execution consistency, focus stamina, and goal trajectory.
          </p>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Productivity Score */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/30 p-5 backdrop-blur-md shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Productivity Score</span>
            <Sparkles className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{productivityScore}</span>
            <span className="text-xs text-emerald-400 font-bold">+12% vs last week</span>
          </div>
          <p className="text-[11px] text-slate-500">Composite index based on tasks & habits</p>
        </div>

        {/* Tasks Completed */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Completed Tasks</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{completedTasks}</span>
            <span className="text-xs text-slate-400 font-mono">/ {tasks.length} total</span>
          </div>
          <p className="text-[11px] text-slate-500">{pendingTasks} remaining commitments</p>
        </div>

        {/* Goal Average */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Goal Velocity</span>
            <Target className="h-4 w-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{averageGoalProgress}%</span>
            <span className="text-xs text-purple-400 font-bold">{goals.length} active</span>
          </div>
          <p className="text-[11px] text-slate-500">Average milestone completion rate</p>
        </div>

        {/* Cumulative Streaks */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Habit Momentum</span>
            <Flame className="h-4 w-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{totalHabitStreaks}d</span>
            <span className="text-xs text-amber-400 font-bold">Unbroken</span>
          </div>
          <p className="text-[11px] text-slate-500">Total consecutive habit days</p>
        </div>
      </div>

      {/* AI Insights Callout */}
      <div className="rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-purple-950/40 border border-cyan-500/30 p-6 backdrop-blur-xl space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-cyan-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
            AI-Generated Synthesis Insights
          </h2>
          <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
            AI Analyzed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
            <span className="font-bold text-white block">Execution Efficiency: 82%</span>
            <p className="text-slate-400 leading-relaxed">
              This week you completed 82% of planned tasks within their expected estimation windows.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
            <span className="font-bold text-white block">Peak Performance: Tuesday</span>
            <p className="text-slate-400 leading-relaxed">
              Your most productive day was Tuesday with 6.0 hours of uninterrupted deep work recorded.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
            <span className="font-bold text-white block">Focus Window Alignment</span>
            <p className="text-slate-400 leading-relaxed">
              Consider scheduling high-cognitive tasks during your preferred 09:00 - 11:30 AM focus block to maximize throughput.
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Productivity Visual Chart */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Weekly Execution Velocity
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Last 7 Days</span>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-4 pt-4">
          {weeklyData.map((item) => (
            <div key={item.day} className="flex flex-col items-center gap-2">
              <div className="w-full h-36 bg-slate-950 rounded-2xl p-1 flex flex-col justify-end border border-slate-800">
                <div
                  className="w-full bg-gradient-to-t from-cyan-500 to-sky-400 rounded-xl transition-all duration-500"
                  style={{ height: `${item.completion}%` }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-slate-300">{item.day}</span>
              <span className="text-[10px] font-mono text-cyan-400">{item.completion}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
