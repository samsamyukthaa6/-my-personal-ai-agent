import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { CommandBox } from '../command/CommandBox';
import {
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  Flame,
  Target,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  Play,
  Check,
  ChevronRight,
  Wand2,
  RefreshCw,
  Bell
} from 'lucide-react';
import { Priority } from '../../types';

export const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    tasks,
    goals,
    habits,
    events,
    dailyPlan,
    recommendations,
    handleRecommendation,
    refreshRecommendations,
    toggleTaskStatus,
    toggleHabitDate,
    generateDailyPlanAI,
    setActiveTab,
    showToast
  } = useApp();

  const [refreshingRecs, setRefreshingRecs] = useState(false);

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // Prioritized tasks
  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const criticalAndHighTasks = pendingTasks
    .filter(t => t.priority === 'critical' || t.priority === 'high')
    .slice(0, 4);

  // Pending Recommendations
  const pendingRecs = recommendations.filter(r => r.status === 'pending');

  const priorityBadgeColors: Record<Priority, string> = {
    critical: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    high: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    medium: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    low: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  };

  const handleManualRefreshRecs = async () => {
    setRefreshingRecs(true);
    await refreshRecommendations();
    setRefreshingRecs(false);
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Header Greeting Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 p-6 sm:p-8 border border-white/5 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-10 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                NEXA Personal Intelligence
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {getGreeting()}, {currentUser?.name?.split(' ')[0] || 'User'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              NEXA is managing your daily priorities, goal trajectory, and focus blocks.
              {pendingTasks.length > 0
                ? ` You have ${pendingTasks.length} pending items and ${criticalAndHighTasks.length} high-leverage focus priorities today.`
                : ' All scheduled tasks for today are up to date!'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('planner')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-semibold transition"
            >
              <Clock className="h-4 w-4" />
              <span>Open Schedule</span>
            </button>
            <button
              onClick={() => generateDailyPlanAI()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-sky-200 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-cyan-500/20 transition active:scale-95"
            >
              <Wand2 className="h-4 w-4" />
              <span>Generate My Day</span>
            </button>
          </div>
        </div>
      </div>

      {/* Prominent AI Command Box */}
      <div className="space-y-1">
        <CommandBox />
      </div>

      {/* Proactive AI Recommendations Section */}
      {pendingRecs.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                Proactive AI Recommendations
              </h2>
            </div>
            <button
              onClick={handleManualRefreshRecs}
              disabled={refreshingRecs}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 transition"
              title="Refresh recommendations"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshingRecs ? 'animate-spin text-cyan-400' : ''}`} />
              <span>Analyze Now</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pendingRecs.map((rec) => (
              <div
                key={rec.id}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-cyan-500/20 p-4 shadow-lg backdrop-blur-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                      AI Suggestion
                    </span>
                    {rec.priority === 'high' && (
                      <span className="text-[10px] font-bold text-amber-300 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Urgent
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1.5">{rec.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {rec.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => handleRecommendation(rec.id, 'do_it')}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold transition text-center shadow-md shadow-cyan-500/20"
                  >
                    {rec.actionLabel || 'Do it'}
                  </button>
                  <button
                    onClick={() => handleRecommendation(rec.id, 'later')}
                    className="py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                  >
                    Later
                  </button>
                  <button
                    onClick={() => handleRecommendation(rec.id, 'dismiss')}
                    className="py-1.5 px-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-slate-400 text-xs transition"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Priorities & Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Priorities (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-cyan-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                Today's Priority Focus
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('tasks')}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
            >
              <span>View all tasks ({tasks.length})</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {criticalAndHighTasks.length === 0 ? (
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 text-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                <p className="text-sm font-semibold text-slate-200">No critical deadlines pending today</p>
                <p className="text-xs text-slate-400 mt-1">
                  You're in a great position. Tell NEXA to plan your next milestone or review your goals.
                </p>
              </div>
            ) : (
              criticalAndHighTasks.map((task) => (
                <div
                  key={task.id}
                  className="group relative overflow-hidden rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/30 p-4 transition-all duration-200 backdrop-blur-md"
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className="mt-0.5 text-slate-500 hover:text-cyan-400 transition"
                    >
                      {task.status === 'completed' ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-500 hover:text-cyan-400" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityBadgeColors[task.priority]}`}>
                          {task.priority.toUpperCase()}
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {task.category}
                        </span>
                        {task.dueDate && (
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                            <Calendar className="h-3 w-3 text-cyan-400" />
                            {task.dueDate} {task.dueTime ? `at ${task.dueTime}` : ''}
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition truncate">
                        {task.title}
                      </h3>

                      {task.description && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                          {task.description}
                        </p>
                      )}

                      {/* Smart Priority Engine Reason */}
                      {task.aiPriorityReason && (
                        <div className="mt-2.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-300 flex items-start gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>
                            <strong className="text-cyan-300 font-semibold">Priority Engine Rationale:</strong> {task.aiPriorityReason}
                          </span>
                        </div>
                      )}

                      {/* Subtasks progress */}
                      {task.subtasks.length > 0 && (
                        <div className="mt-2 text-xs text-slate-400 flex items-center gap-2">
                          <div className="h-1.5 flex-1 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-cyan-400 rounded-full"
                              style={{
                                width: `${Math.round(
                                  (task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100
                                )}%`
                              }}
                            />
                          </div>
                          <span className="text-[10px] font-mono">
                            {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} subtasks
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Daily Schedule Preview */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Today's Scheduled Roadmap
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('planner')}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
              >
                Full Planner
              </button>
            </div>

            {dailyPlan && dailyPlan.timeBlocks.length > 0 ? (
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {dailyPlan.timeBlocks.slice(0, 4).map((block) => (
                    <div
                      key={block.id}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs transition ${
                        block.completed
                          ? 'bg-slate-900/40 border-slate-800 text-slate-500 line-through'
                          : 'bg-slate-950 border-slate-800/80 text-slate-200'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <span className="font-mono text-[10px] text-cyan-400 block font-semibold">
                          {block.time}
                        </span>
                        <span className="font-medium truncate">{block.title}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 shrink-0">
                        {block.durationMinutes}m
                      </span>
                    </div>
                  ))}
                </div>
                {dailyPlan.aiNotes && (
                  <p className="text-[11px] text-slate-400 italic pt-1">
                    "{dailyPlan.aiNotes}"
                  </p>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center">
                <p className="text-xs text-slate-400 mb-2">No timed schedule generated yet for today.</p>
                <button
                  onClick={() => generateDailyPlanAI()}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold border border-cyan-500/30"
                >
                  Generate Optimized Day
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Habits, Goals & Events */}
        <div className="space-y-6">
          {/* Active Goals Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Active Goals
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('goals')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                Manage
              </button>
            </div>

            <div className="space-y-3">
              {goals.slice(0, 3).map((goal) => (
                <div key={goal.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white truncate max-w-[170px]">
                      {goal.title}
                    </span>
                    <span className="font-mono text-cyan-400 font-bold">
                      {goal.progress}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{goal.milestones.filter(m => m.completed).length}/{goal.milestones.length} milestones</span>
                    <span>Target: {goal.targetDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Habit Streaks Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Daily Habit Streaks
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('habits')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                Track
              </button>
            </div>

            <div className="space-y-2">
              {habits.slice(0, 4).map((habit) => {
                const isCompletedToday = habit.completedDates.includes(todayStr);
                return (
                  <div
                    key={habit.id}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <button
                        onClick={() => toggleHabitDate(habit.id)}
                        className={`h-7 w-7 rounded-lg flex items-center justify-center transition ${
                          isCompletedToday
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                        title={isCompletedToday ? 'Completed today' : 'Mark completed today'}
                      >
                        {isCompletedToday ? <Check className="h-4 w-4" /> : <Play className="h-3 w-3" />}
                      </button>
                      <div className="truncate">
                        <span className="text-xs font-semibold text-white truncate block">
                          {habit.title}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {habit.timeOfDay} • {habit.targetCount} {habit.unit}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 font-mono text-xs font-bold text-amber-300">
                      <Flame className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{habit.currentStreak}d</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Events glance */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-sky-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Upcoming Events
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('calendar')}
                className="text-xs text-sky-400 hover:text-sky-300 font-semibold"
              >
                Calendar
              </button>
            </div>

            <div className="space-y-2">
              {events.slice(0, 3).map((evt) => (
                <div
                  key={evt.id}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-start gap-2.5"
                >
                  <div className="flex flex-col items-center justify-center px-2 py-1 rounded bg-slate-900 border border-slate-800 font-mono text-[10px] shrink-0">
                    <span className="text-cyan-400 font-bold">
                      {evt.startDate.split('T')[1] || 'All Day'}
                    </span>
                  </div>
                  <div className="truncate flex-1">
                    <span className="font-bold text-white block truncate">{evt.title}</span>
                    <span className="text-[10px] text-slate-400 truncate block">
                      {evt.location || evt.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
