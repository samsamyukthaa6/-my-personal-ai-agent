import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  CheckSquare,
  Target,
  Clock,
  GraduationCap,
  Flame,
  Calendar,
  BookOpen,
  Bot,
  BarChart3,
  Brain,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed, onOpenSettings }) => {
  const { activeTab, setActiveTab } = useApp();

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'tasks', name: 'Tasks', icon: CheckSquare, badge: null },
    { id: 'goals', name: 'Goals', icon: Target, badge: null },
    { id: 'planner', name: 'Daily Planner', icon: Clock, badge: 'AI' },
    { id: 'study', name: 'Study Mode', icon: GraduationCap, badge: null },
    { id: 'habits', name: 'Habits', icon: Flame, badge: null },
    { id: 'calendar', name: 'Calendar', icon: Calendar, badge: null },
    { id: 'notes', name: 'AI Notes', icon: BookOpen, badge: null },
    { id: 'assistant', name: 'AI Assistant', icon: Bot, badge: 'Agent' },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, badge: null },
    { id: 'memory', name: 'AI Memory', icon: Brain, badge: null },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-white/5 bg-slate-950/80 backdrop-blur-xl transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Toggle button */}
      <div className="flex items-center justify-end px-4 py-3 border-b border-white/5">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 space-y-1.5 px-3 py-4 overflow-y-auto scrollbar-none">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all group relative ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/15 to-purple-500/10 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-950/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon
                className={`h-4 w-4 shrink-0 transition ${
                  isActive ? 'text-cyan-400 scale-110' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />

              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between truncate">
                  <span className="truncate">{item.name}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}

              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-cyan-400" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Settings & Proactive AI status */}
      <div className="p-3 border-t border-white/5 space-y-2">
        <button
          onClick={onOpenSettings}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 transition ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Settings' : undefined}
        >
          <Settings className="h-4 w-4 text-slate-400 shrink-0" />
          {!isCollapsed && <span>Settings</span>}
        </button>

        {!isCollapsed && (
          <div className="p-3 rounded-xl bg-slate-900/60 border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-[11px] font-semibold text-cyan-300">
                NEXA Active
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Gemini 3.8 reasoning engine connected & isolated.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};
