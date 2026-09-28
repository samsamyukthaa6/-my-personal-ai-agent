import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { TimeBlock } from '../../types';
import {
  Clock,
  Wand2,
  RefreshCw,
  CheckCircle2,
  Circle,
  Calendar,
  Sparkles,
  Layers,
  Flame,
  BookOpen,
  Coffee,
  Check,
  Plus,
  Trash2,
  Edit2
} from 'lucide-react';

export const DailyPlanner: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    dailyPlan,
    generateDailyPlanAI,
    toggleTimeBlock,
    showToast
  } = useApp();

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    await generateDailyPlanAI();
    setLoading(false);
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'task': return <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />;
      case 'habit': return <Flame className="h-3.5 w-3.5 text-amber-400" />;
      case 'study': return <BookOpen className="h-3.5 w-3.5 text-purple-400" />;
      case 'event': return <Calendar className="h-3.5 w-3.5 text-sky-400" />;
      case 'break': return <Coffee className="h-3.5 w-3.5 text-emerald-400" />;
      default: return <Clock className="h-3.5 w-3.5 text-slate-400" />;
    }
  };

  const completedBlocks = dailyPlan?.timeBlocks.filter(b => b.completed).length || 0;
  const totalBlocks = dailyPlan?.timeBlocks.length || 0;
  const progressPercent = totalBlocks > 0 ? Math.round((completedBlocks / totalBlocks) * 100) : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-5 w-5 text-purple-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
              Chrono Optimization
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Smart Daily Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            AI-sequenced day tailored to your cognitive peaks, pending deadlines, and recovery habits.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-sky-200 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-cyan-500/20 transition active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4" />
            )}
            <span>{dailyPlan ? 'Regenerate Plan' : 'Generate My Day'}</span>
          </button>
        </div>
      </div>

      {/* Progress & AI Notes Card */}
      {dailyPlan && (
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-5 sm:p-6 backdrop-blur-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Schedule for {dailyPlan.date}
              </span>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xl font-extrabold text-white">
                  {completedBlocks} of {totalBlocks} Blocks Finished
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold">
                  {progressPercent}% Complete
                </span>
              </div>
            </div>

            <div className="w-full sm:w-48">
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {dailyPlan.aiNotes && (
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300">
              <Sparkles className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-cyan-300 font-semibold">AI Rationale: </strong>
                <span>{dailyPlan.aiNotes}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Timeline Stream */}
      {!dailyPlan || dailyPlan.timeBlocks.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-12 text-center space-y-3">
          <Wand2 className="h-10 w-10 text-cyan-400 mx-auto opacity-80" />
          <h3 className="text-base font-bold text-white">No Daily Schedule Active</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Click "Generate My Day" to allow NEXA to synthesize your tasks, calendar events, habits, and preferences into a structured timeline.
          </p>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-2 px-5 py-2.5 rounded-xl bg-cyan-400 text-slate-950 text-xs font-bold hover:bg-cyan-300 transition"
          >
            Generate My Day
          </button>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 space-y-4">
          {/* Vertical connecting line */}
          <div className="absolute left-2.5 sm:left-3.5 top-3 bottom-3 w-0.5 bg-gradient-to-b from-cyan-500/40 via-purple-500/30 to-slate-800" />

          {dailyPlan.timeBlocks.map((block, idx) => (
            <div
              key={block.id}
              className={`relative group rounded-2xl p-4 sm:p-5 border transition-all backdrop-blur-md ${
                block.completed
                  ? 'bg-slate-950/60 border-slate-800/60 opacity-60'
                  : 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/40 shadow-lg'
              }`}
            >
              {/* Bullet Node */}
              <div
                className={`absolute -left-6 sm:-left-8 top-5 flex h-5 w-5 items-center justify-center rounded-full border-2 transition ${
                  block.completed
                    ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                    : 'border-cyan-400 bg-slate-950 text-cyan-400'
                }`}
              >
                {block.completed && <Check className="h-3 w-3 stroke-[3]" />}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                      {block.time}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                      {getSourceIcon(block.source)}
                      <span className="capitalize">{block.source}</span>
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {block.category}
                    </span>
                  </div>

                  <h3 className={`text-sm sm:text-base font-bold text-white transition ${
                    block.completed ? 'line-through text-slate-400' : ''
                  }`}>
                    {block.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="text-xs font-mono text-slate-400">
                    {block.durationMinutes} mins
                  </span>

                  <button
                    onClick={() => toggleTimeBlock(block.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      block.completed
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    {block.completed ? 'Completed' : 'Mark Complete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
