import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { UserMemory } from '../../types';
import {
  Brain,
  Plus,
  Trash2,
  Edit2,
  ShieldCheck,
  Check,
  ToggleLeft,
  ToggleRight,
  Info,
  Clock,
  Sparkles
} from 'lucide-react';

export const MemorySettings: React.FC = () => {
  const { currentUser, updatePreferences } = useAuth();
  const {
    memories,
    addMemory,
    updateMemory,
    deleteMemory,
    toggleMemoryEnabled,
    showToast
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMemId, setEditingMemId] = useState<string | null>(null);

  // Form state
  const [newCategory, setNewCategory] = useState<UserMemory['category']>('work_habit');
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const memoryEnabled = currentUser?.preferences.enableAiMemory ?? true;

  const handleToggleSystemMemory = () => {
    updatePreferences({ enableAiMemory: !memoryEnabled });
    showToast(`AI Memory ${!memoryEnabled ? 'Enabled' : 'Disabled'}`);
  };

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;

    if (editingMemId) {
      updateMemory(editingMemId, {
        category: newCategory,
        key: newKey.trim(),
        value: newValue.trim()
      });
      setEditingMemId(null);
    } else {
      addMemory({
        category: newCategory,
        key: newKey.trim(),
        value: newValue.trim(),
        enabled: true
      });
    }

    setNewKey('');
    setNewValue('');
    setIsAddModalOpen(false);
  };

  const handleStartEdit = (mem: UserMemory) => {
    setEditingMemId(mem.id);
    setNewCategory(mem.category);
    setNewKey(mem.key);
    setNewValue(mem.value);
    setIsAddModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Brain className="h-5 w-5 text-purple-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
              Personalized Knowledge Graph
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Memory & Cognitive Preferences
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Transparently manage what NEXA remembers about your peak hours, planning rituals, and learning style.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditingMemId(null);
              setNewKey('');
              setNewValue('');
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-500/20 transition active:scale-95 shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Add Memory</span>
          </button>
        </div>
      </div>

      {/* Global Memory Toggle & Security Callout */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-400 shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">AI Memory Persistence</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                When enabled, NEXA uses these non-sensitive preferences to contextualize daily schedules and suggestions.
              </p>
            </div>
          </div>

          <button
            onClick={handleToggleSystemMemory}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
              memoryEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            <span>{memoryEnabled ? 'Memory Enabled' : 'Memory Disabled'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400">
          <Info className="h-4 w-4 text-cyan-400 shrink-0" />
          <span>
            Privacy Guard: Memories are isolated to your account ID. No passwords, payment details, or credentials are ever retained.
          </span>
        </div>
      </div>

      {/* Memories List */}
      <div className="space-y-3">
        {memories.map((mem) => (
          <div
            key={mem.id}
            className={`p-4 sm:p-5 rounded-2xl border transition backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              mem.enabled
                ? 'bg-slate-900/80 border-slate-800 hover:border-purple-500/30'
                : 'bg-slate-950/40 border-slate-900 opacity-50'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/20">
                  {mem.category.replace('_', ' ')}
                </span>
                <span className="font-bold text-sm text-white">{mem.key}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                {mem.value}
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                onClick={() => toggleMemoryEnabled(mem.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  mem.enabled
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {mem.enabled ? 'Active' : 'Disabled'}
              </button>

              <button
                onClick={() => handleStartEdit(mem)}
                className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl transition"
                title="Edit memory"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => deleteMemory(mem.id)}
                className="p-2 text-slate-400 hover:text-rose-400 bg-slate-800 rounded-xl transition"
                title="Delete memory"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Memory Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-purple-500/30 p-6 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-white">
              {editingMemId ? 'Edit Memory' : 'Store New Memory'}
            </h2>
            <form onSubmit={handleAddMemory} className="space-y-3.5">
              <div>
                <label className="text-xs font-medium text-slate-400">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="work_habit">Work Habit & Focus Hours</option>
                  <option value="routine">Routine & Recovery</option>
                  <option value="learning_style">Learning Style & Study Pacing</option>
                  <option value="preference">General Planning Preference</option>
                  <option value="goal_context">High-Level Objective Context</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400">Memory Key / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deep Work Peak Window"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400">Memory Value / Details *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Most energized between 09:00 AM and 11:30 AM. Prefers hard coding tasks then."
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold shadow-lg shadow-purple-500/20"
                >
                  {editingMemId ? 'Save Changes' : 'Store Memory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
