import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Goal, Category } from '../../types';
import {
  Target,
  Plus,
  Wand2,
  Calendar,
  CheckCircle2,
  Circle,
  Trash2,
  ArrowRight,
  TrendingUp,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

export const GoalManager: React.FC = () => {
  const {
    goals,
    tasks,
    addGoal,
    updateGoal,
    deleteGoal,
    toggleMilestone,
    generateGoalPlanAI,
    showToast
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(goals[0]?.id || null);

  // New goal state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<Category>('Work');
  const [newTargetDate, setNewTargetDate] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  );

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addGoal({
      title: newTitle.trim(),
      description: newDescription.trim(),
      category: newCategory,
      targetDate: newTargetDate,
      progress: 0,
      status: 'active',
      milestones: []
    });

    setNewTitle('');
    setNewDescription('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-5 w-5 text-cyan-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Strategic Vision
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Goal Management & AI Decomposition
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Define objectives, convert them into milestones, and automatically generate task roadmaps.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-sky-200 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-cyan-500/20 transition active:scale-95 shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const isExpanded = expandedGoalId === goal.id;
          const relatedTasks = tasks.filter((t) => t.goalId === goal.id);

          return (
            <div
              key={goal.id}
              className="rounded-3xl bg-slate-900/80 border border-slate-800 p-5 sm:p-6 backdrop-blur-xl space-y-4 hover:border-cyan-500/30 transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {goal.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white mt-1.5">
                      {goal.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition"
                    title="Delete goal"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {goal.description}
                </p>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Trajectory</span>
                    <span className="font-mono text-cyan-300 font-bold">{goal.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-cyan-400" />
                      Target: {goal.targetDate}
                    </span>
                    <span>
                      {goal.milestones.filter((m) => m.completed).length}/{goal.milestones.length} Milestones
                    </span>
                  </div>
                </div>

                {/* AI Plan Generation Button */}
                <div className="pt-2">
                  <button
                    onClick={() => generateGoalPlanAI(goal.id)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 text-xs font-semibold transition"
                  >
                    <Wand2 className="h-3.5 w-3.5 text-purple-400" />
                    <span>Generate AI Execution Plan</span>
                  </button>
                </div>

                {/* Milestones list */}
                {goal.milestones.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => setExpandedGoalId(isExpanded ? null : goal.id)}
                      className="flex items-center justify-between w-full text-xs font-semibold text-slate-300 hover:text-white"
                    >
                      <span>Milestones & Action Steps</span>
                      {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="space-y-1.5 pt-1">
                        {goal.milestones.map((m) => (
                          <div
                            key={m.id}
                            className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs"
                          >
                            <button
                              onClick={() => toggleMilestone(goal.id, m.id)}
                              className="text-slate-500 hover:text-cyan-400 transition"
                            >
                              {m.completed ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                              ) : (
                                <Circle className="h-4 w-4 text-slate-500" />
                              )}
                            </button>
                            <span className={`flex-1 text-slate-200 ${m.completed ? 'line-through text-slate-500' : ''}`}>
                              {m.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Goal Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-white">Create New Goal</h2>
            <form onSubmit={handleCreateGoal} className="space-y-3.5">
              <div>
                <label className="text-xs font-medium text-slate-400">Goal Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Machine Learning & Neural Networks"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400">Description</label>
                <textarea
                  rows={2}
                  placeholder="What does success look like? What is the core outcome?"
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
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Study">Study</option>
                    <option value="Health">Health</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400">Target Date</label>
                  <input
                    type="date"
                    value={newTargetDate}
                    onChange={(e) => setNewTargetDate(e.target.value)}
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
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
