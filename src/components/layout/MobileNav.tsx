import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Bot,
  Menu,
  X,
  Target,
  Clock,
  GraduationCap,
  Flame,
  BookOpen,
  BarChart3,
  Brain,
  Settings
} from 'lucide-react';

interface MobileNavProps {
  onOpenSettings: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onOpenSettings }) => {
  const { activeTab, setActiveTab } = useApp();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const mainItems = [
    { id: 'dashboard', name: 'Home', icon: LayoutDashboard },
    { id: 'tasks', name: 'Tasks', icon: CheckSquare },
    { id: 'assistant', name: 'AI', icon: Bot, highlight: true },
    { id: 'calendar', name: 'Calendar', icon: Calendar },
  ];

  const moreItems = [
    { id: 'planner', name: 'Daily Planner', icon: Clock },
    { id: 'goals', name: 'Goals', icon: Target },
    { id: 'study', name: 'Study Mode', icon: GraduationCap },
    { id: 'habits', name: 'Habits', icon: Flame },
    { id: 'notes', name: 'AI Notes', icon: BookOpen },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'memory', name: 'AI Memory', icon: Brain },
  ];

  return (
    <>
      {/* More Menu Sheet */}
      {moreMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-slate-950/80 backdrop-blur-md">
          <div className="fixed bottom-16 inset-x-0 bg-slate-900 border-t border-slate-800 p-4 rounded-t-3xl shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">All NEXA Modules</h3>
              <button
                onClick={() => setMoreMenuOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 py-2">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMoreMenuOpen(false);
                    }}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="h-4 w-4 text-cyan-400" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                setMoreMenuOpen(false);
                onOpenSettings();
              }}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
            >
              <Settings className="h-4 w-4 text-slate-400" />
              Settings & Account
            </button>
          </div>
        </div>
      )}

      {/* Bottom Sticky Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 md:hidden border-t border-white/5 bg-slate-950/90 backdrop-blur-xl px-2 py-1.5">
        <div className="flex items-center justify-around">
          {mainItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMoreMenuOpen(false);
                }}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
                  item.highlight
                    ? 'relative -top-2'
                    : ''
                }`}
              >
                {item.highlight ? (
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/30 text-white ${
                    isActive ? 'ring-2 ring-cyan-300 scale-105' : ''
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                ) : (
                  <Icon className={`h-5 w-5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                )}
                <span className={`text-[10px] mt-0.5 font-medium ${isActive ? 'text-cyan-300 font-bold' : 'text-slate-400'}`}>
                  {item.name}
                </span>
              </button>
            );
          })}

          {/* More Toggle */}
          <button
            onClick={() => setMoreMenuOpen(!moreMenuOpen)}
            className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-400 hover:text-white"
          >
            <Menu className="h-5 w-5" />
            <span className="text-[10px] mt-0.5 font-medium">More</span>
          </button>
        </div>
      </div>
    </>
  );
};
