import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { createDemoData, saveUserData } from '../../services/storage';
import {
  Settings,
  X,
  User,
  Clock,
  Palette,
  Shield,
  Download,
  RotateCcw,
  Check,
  Sparkles
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateUser, updatePreferences } = useAuth();
  const { showToast } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [workingStart, setWorkingStart] = useState(currentUser?.preferences.workingHoursStart || '09:00');
  const [workingEnd, setWorkingEnd] = useState(currentUser?.preferences.workingHoursEnd || '17:00');
  const [dailyHours, setDailyHours] = useState(currentUser?.preferences.dailyAvailableHours || 8);
  const [planningStyle, setPlanningStyle] = useState(currentUser?.preferences.planningStyle || 'balanced');
  const [mainGoal, setMainGoal] = useState(currentUser?.preferences.mainGoal || '');
  const [theme, setTheme] = useState(currentUser?.preferences.theme || 'dark');

  if (!isOpen || !currentUser) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name });
    updatePreferences({
      workingHoursStart: workingStart,
      workingHoursEnd: workingEnd,
      dailyAvailableHours: Number(dailyHours),
      planningStyle: planningStyle as any,
      mainGoal,
      theme: theme as any
    });
    document.documentElement.classList.toggle('dark', theme === 'dark');
    showToast('Settings saved successfully');
    onClose();
  };

  const handleResetDemoData = () => {
    if (confirm('Are you sure you want to reset your workspace to fresh demo data?')) {
      const demoStore = createDemoData(currentUser.id);
      saveUserData(currentUser.id, demoStore);
      window.location.reload();
    }
  };

  const handleExportData = () => {
    const raw = localStorage.getItem(`nexa_data_${currentUser.id}`);
    if (!raw) return;
    const blob = new Blob([raw], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexa-backup-${currentUser.id}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Exported JSON backup!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">NEXA Settings</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Profile Name */}
          <div>
            <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-cyan-400" />
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Working Hours */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-purple-400" />
                Work Start Time
              </label>
              <input
                type="time"
                value={workingStart}
                onChange={(e) => setWorkingStart(e.target.value)}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-purple-400" />
                Work End Time
              </label>
              <input
                type="time"
                value={workingEnd}
                onChange={(e) => setWorkingEnd(e.target.value)}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Planning Style & Daily Hours */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-400">Daily Focus Hours</label>
              <input
                type="number"
                min={2}
                max={16}
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400">Planning Style</label>
              <select
                value={planningStyle}
                onChange={(e) => setPlanningStyle(e.target.value as any)}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="structured">Structured (Firm Blocks)</option>
                <option value="balanced">Balanced (Optimal Pacing)</option>
                <option value="flexible">Flexible (Fluid Prioritization)</option>
              </select>
            </div>
          </div>

          {/* Main Focus Goal */}
          <div>
            <label className="text-xs font-medium text-slate-400">Primary Objective Context</label>
            <input
              type="text"
              value={mainGoal}
              onChange={(e) => setMainGoal(e.target.value)}
              placeholder="e.g. Launch NEXA AI SaaS MVP"
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Theme */}
          <div>
            <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Palette className="h-3.5 w-3.5 text-cyan-400" />
              Theme Appearance
            </label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                  theme === 'dark'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Deep Dark (Recommended)
              </button>
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                  theme === 'light'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Light Mode
              </button>
            </div>
          </div>

          {/* Data Controls */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Data Management & Backup
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleExportData}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export JSON Backup</span>
              </button>
              <button
                type="button"
                onClick={handleResetDemoData}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-medium transition"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Demo Data</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-300 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
