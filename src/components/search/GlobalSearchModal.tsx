import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  X,
  CheckSquare,
  Target,
  BookOpen,
  Calendar,
  Flame,
  ArrowRight
} from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    tasks,
    goals,
    notes,
    events,
    habits,
    setActiveTab
  } = useApp();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedTasks = q ? tasks.filter(t => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)).slice(0, 4) : [];
  const matchedGoals = q ? goals.filter(g => g.title.toLowerCase().includes(q) || g.description.toLowerCase().includes(q)).slice(0, 3) : [];
  const matchedNotes = q ? notes.filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)).slice(0, 3) : [];
  const matchedEvents = q ? events.filter(e => e.title.toLowerCase().includes(q) || e.location?.toLowerCase().includes(q)).slice(0, 3) : [];
  const matchedHabits = q ? habits.filter(h => h.title.toLowerCase().includes(q)).slice(0, 3) : [];

  const hasResults =
    matchedTasks.length > 0 ||
    matchedGoals.length > 0 ||
    matchedNotes.length > 0 ||
    matchedEvents.length > 0 ||
    matchedHabits.length > 0;

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    setIsSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden space-y-0">
        {/* Search Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-950">
          <Search className="h-5 w-5 text-cyan-400 mr-3" />
          <input
            type="text"
            placeholder="Search tasks, goals, notes, habits, events..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-white mr-2">
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results Area */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {!q ? (
            <div className="text-center py-8 text-xs text-slate-500">
              Type anything to search across your isolated personal workspace.
            </div>
          ) : !hasResults ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No matching records found for "{query}".
            </div>
          ) : (
            <>
              {matchedTasks.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 px-2">
                    <CheckSquare className="h-3.5 w-3.5" />
                    Tasks
                  </span>
                  {matchedTasks.map(t => (
                    <div
                      key={t.id}
                      onClick={() => handleSelectTab('tasks')}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 cursor-pointer text-xs transition"
                    >
                      <span className="font-semibold text-white">{t.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{t.dueDate}</span>
                    </div>
                  ))}
                </div>
              )}

              {matchedGoals.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5 px-2">
                    <Target className="h-3.5 w-3.5" />
                    Goals
                  </span>
                  {matchedGoals.map(g => (
                    <div
                      key={g.id}
                      onClick={() => handleSelectTab('goals')}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 cursor-pointer text-xs transition"
                    >
                      <span className="font-semibold text-white">{g.title}</span>
                      <span className="text-[10px] text-purple-400 font-mono">{g.progress}%</span>
                    </div>
                  ))}
                </div>
              )}

              {matchedNotes.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5 px-2">
                    <BookOpen className="h-3.5 w-3.5" />
                    Notes
                  </span>
                  {matchedNotes.map(n => (
                    <div
                      key={n.id}
                      onClick={() => handleSelectTab('notes')}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 cursor-pointer text-xs transition"
                    >
                      <span className="font-semibold text-white">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.category}</span>
                    </div>
                  ))}
                </div>
              )}

              {matchedHabits.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 px-2">
                    <Flame className="h-3.5 w-3.5" />
                    Habits
                  </span>
                  {matchedHabits.map(h => (
                    <div
                      key={h.id}
                      onClick={() => handleSelectTab('habits')}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 cursor-pointer text-xs transition"
                    >
                      <span className="font-semibold text-white">{h.title}</span>
                      <span className="text-[10px] text-amber-400 font-mono">{h.currentStreak}d streak</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
