import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  X,
  CheckCheck,
  Trash2,
  Calendar,
  CheckCircle2,
  Flame,
  Sparkles,
  Info
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    setActiveTab
  } = useApp();

  if (!isOpen) return null;

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'task': return <CheckCircle2 className="h-4 w-4 text-cyan-400" />;
      case 'habit': return <Flame className="h-4 w-4 text-amber-400" />;
      case 'event': return <Calendar className="h-4 w-4 text-sky-400" />;
      case 'ai': return <Sparkles className="h-4 w-4 text-purple-400" />;
      default: return <Info className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/80">
            <div className="flex items-center gap-2.5">
              <Bell className="h-5 w-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white">Notifications</h2>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-mono font-semibold">
                {notifications.filter(n => !n.read).length} Unread
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={markAllNotificationsRead}
                className="p-1.5 text-xs text-slate-400 hover:text-white rounded-lg transition"
                title="Mark all as read"
              >
                <CheckCheck className="h-4 w-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No notifications right now.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    markNotificationRead(n.id);
                    if (n.linkTab) {
                      setActiveTab(n.linkTab);
                      onClose();
                    }
                  }}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                    n.read
                      ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                      : 'bg-slate-950 border-cyan-500/30 shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      {getNotifIcon(n.type)}
                      <h4 className="text-xs font-bold text-white">{n.title}</h4>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(n.id);
                      }}
                      className="text-slate-500 hover:text-rose-400 p-0.5 transition"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 pl-6 leading-relaxed">
                    {n.message}
                  </p>

                  <span className="text-[10px] font-mono text-slate-500 block text-right mt-2">
                    {n.timestamp}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
