import React, { useState } from 'react';
import { ActionProposal, Priority, Category } from '../../types';
import { CheckCircle2, XCircle, Edit3, Sparkles, Clock, Calendar, AlertCircle } from 'lucide-react';

interface ConfirmationCardProps {
  proposal: ActionProposal;
  onConfirm: (payload?: any) => void;
  onCancel: () => void;
}

export const ConfirmationCard: React.FC<ConfirmationCardProps> = ({
  proposal,
  onConfirm,
  onCancel
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(proposal.payload?.title || proposal.title);
  const [editedDate, setEditedDate] = useState(proposal.payload?.dueDate || proposal.payload?.targetDate || '');
  const [editedTime, setEditedTime] = useState(proposal.payload?.time || '');
  const [editedPriority, setEditedPriority] = useState<Priority>(proposal.payload?.priority || 'medium');
  const [editedCategory, setEditedCategory] = useState<Category>(proposal.payload?.category || 'Work');

  const handleConfirm = () => {
    if (isEditing) {
      const updatedPayload = {
        ...proposal.payload,
        title: editedTitle,
        dueDate: editedDate,
        targetDate: editedDate,
        time: editedTime,
        priority: editedPriority,
        category: editedCategory
      };
      onConfirm(updatedPayload);
    } else {
      onConfirm();
    }
  };

  const getActionLabel = (type: string) => {
    switch (type) {
      case 'create_task': return 'Create Task';
      case 'create_reminder': return 'Create Reminder';
      case 'create_event': return 'Schedule Calendar Event';
      case 'create_goal': return 'Create Goal';
      case 'create_habit': return 'Establish Habit';
      case 'create_note': return 'Create Note';
      case 'generate_daily_plan': return 'Generate Daily Plan';
      case 'create_study_plan': return 'Generate Study Roadmap';
      default: return 'Perform Action';
    }
  };

  const priorityColors: Record<Priority, string> = {
    critical: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    high: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    medium: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    low: 'bg-slate-500/20 text-slate-300 border-slate-500/40'
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-slate-900/90 backdrop-blur-xl p-5 shadow-2xl shadow-cyan-950/40 transition-all animate-in fade-in zoom-in-95 duration-200">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-32 w-32 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />

      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 text-cyan-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              AI Action Confirmation
            </span>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              {getActionLabel(proposal.actionType)}
            </h4>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700 transition"
        >
          <Edit3 className="h-3.5 w-3.5" />
          {isEditing ? 'Cancel Edit' : 'Edit'}
        </button>
      </div>

      {proposal.explanation && (
        <p className="text-xs text-slate-400 mb-3 italic">
          "{proposal.explanation}"
        </p>
      )}

      {/* Content preview or edit mode */}
      <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800/80 mb-4 space-y-2.5">
        {isEditing ? (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-400">Title</label>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium text-slate-400">Date</label>
                <input
                  type="date"
                  value={editedDate}
                  onChange={(e) => setEditedDate(e.target.value)}
                  className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400">Time</label>
                <input
                  type="text"
                  placeholder="e.g. 10:00 AM"
                  value={editedTime}
                  onChange={(e) => setEditedTime(e.target.value)}
                  className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium text-slate-400">Priority</label>
                <select
                  value={editedPriority}
                  onChange={(e) => setEditedPriority(e.target.value as Priority)}
                  className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400">Category</label>
                <select
                  value={editedCategory}
                  onChange={(e) => setEditedCategory(e.target.value as Category)}
                  className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Study">Study</option>
                  <option value="Health">Health</option>
                  <option value="Finance">Finance</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-sm font-semibold text-slate-100 flex items-center justify-between">
              <span>{proposal.payload?.title || proposal.title}</span>
              {proposal.payload?.priority && (
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${priorityColors[proposal.payload.priority as Priority] || priorityColors.medium}`}>
                  {proposal.payload.priority.toUpperCase()}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 mt-1">
              {proposal.summary}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-2 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
              {(proposal.payload?.dueDate || proposal.payload?.targetDate) && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                  {proposal.payload.dueDate || proposal.payload.targetDate}
                </span>
              )}
              {proposal.payload?.time && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-purple-400" />
                  {proposal.payload.time}
                </span>
              )}
              {proposal.payload?.category && (
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                  {proposal.payload.category}
                </span>
              )}
            </div>

            {proposal.payload?.subtasks && proposal.payload.subtasks.length > 0 && (
              <div className="mt-2.5 pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-medium text-slate-400 block mb-1">Subtasks:</span>
                <ul className="space-y-1">
                  {proposal.payload.subtasks.map((st: string, idx: number) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      {st}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Actions */}
      <div className="flex items-center justify-end gap-2.5">
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 rounded-xl transition border border-slate-700/60"
        >
          <XCircle className="h-4 w-4" />
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-sky-200 rounded-xl shadow-lg shadow-cyan-500/25 transition active:scale-95"
        >
          <CheckCircle2 className="h-4 w-4 text-slate-950" />
          Confirm Action
        </button>
      </div>
    </div>
  );
};
