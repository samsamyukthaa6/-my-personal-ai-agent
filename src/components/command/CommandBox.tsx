import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AIService } from '../../services/aiService';
import { ConfirmationCard } from './ConfirmationCard';
import { Sparkles, ArrowRight, Loader2, HelpCircle, CornerDownLeft, Wand2 } from 'lucide-react';

export const CommandBox: React.FC = () => {
  const {
    tasks,
    goals,
    habits,
    memories,
    pendingAction,
    setPendingAction,
    confirmPendingAction,
    cancelPendingAction,
    showToast
  } = useApp();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [clarification, setClarification] = useState<string | null>(null);

  const samplePrompts = [
    'Plan my day',
    'Remind me to call Arun tomorrow at 10 AM',
    'I have an exam next Friday. Create a study plan',
    'Break this project into smaller tasks',
    'Show me what I should focus on today'
  ];

  const handleExecute = async (queryText?: string) => {
    const textToRun = (queryText || input).trim();
    if (!textToRun || loading) return;

    setLoading(true);
    setClarification(null);

    try {
      const response = await AIService.parseCommand(textToRun, {
        tasks,
        goals,
        habits,
        memories: memories.filter(m => m.enabled)
      });

      if (response.type === 'clarification' && response.clarificationQuestion) {
        setClarification(response.clarificationQuestion);
        showToast('NEXA needs a little more detail', 'info');
      } else if (response.action) {
        setPendingAction(response.action);
        setInput('');
      } else {
        showToast(response.explanation || 'Command processed.', 'info');
      }
    } catch (err: any) {
      showToast('Could not process command with AI.', 'warning');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleExecute();
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Active Confirmation Card (if any pending action) */}
      {pendingAction && (
        <ConfirmationCard
          proposal={pendingAction}
          onConfirm={(customPayload) => confirmPendingAction(customPayload)}
          onCancel={cancelPendingAction}
        />
      )}

      {/* Clarification prompt dialog */}
      {clarification && !pendingAction && (
        <div className="rounded-2xl border border-purple-500/40 bg-purple-950/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
              <HelpCircle className="h-4 w-4" />
            </div>
            <div className="space-y-2 flex-1">
              <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
                Clarification Needed
              </span>
              <p className="text-sm font-medium text-slate-100">
                {clarification}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Provide details (e.g. 'Mathematics for 2 hours')..."
                  className="flex-1 bg-slate-900/90 border border-purple-500/40 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = (e.target as HTMLInputElement).value;
                      if (val) {
                        handleExecute(`${input} - ${val}`);
                      }
                    }
                  }}
                  autoFocus
                />
                <button
                  onClick={() => setClarification(null)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-xl"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Command Input Box */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-sky-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-45 transition duration-300 pointer-events-none" />

        <div className="relative flex items-center rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-cyan-500/20 p-2 shadow-xl shadow-cyan-950/20">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/10 text-cyan-400 ml-1">
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
            ) : (
              <Wand2 className="h-5 w-5 text-cyan-400" />
            )}
          </div>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            placeholder="Tell NEXA what you need... (e.g. 'Plan my day' or 'Remind me to call Arun tomorrow at 10 AM')"
            className="flex-1 bg-transparent px-4 py-2.5 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
          />

          <div className="flex items-center gap-2 mr-1">
            <button
              onClick={() => handleExecute()}
              disabled={loading || !input.trim()}
              className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-sky-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-md shadow-cyan-500/20 transition active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                  <span className="hidden sm:inline">Reasoning...</span>
                </>
              ) : (
                <>
                  <span>Execute</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Command Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-slate-500 font-medium shrink-0 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-cyan-400" />
          Try:
        </span>
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => {
              setInput(prompt);
              handleExecute(prompt);
            }}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-slate-800/80 hover:border-cyan-500/30 transition text-[11px] whitespace-nowrap"
          >
            "{prompt}"
          </button>
        ))}
      </div>
    </div>
  );
};
