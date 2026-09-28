import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ConfirmationCard } from '../command/ConfirmationCard';
import {
  Bot,
  Sparkles,
  Send,
  Trash2,
  Loader2,
  CheckCircle2,
  RefreshCw,
  User as UserIcon,
  CornerDownLeft
} from 'lucide-react';

export const AIAssistant: React.FC = () => {
  const {
    chatMessages,
    sendChatMessage,
    clearChatHistory,
    confirmPendingAction,
    setPendingAction,
    showToast
  } = useApp();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    'Plan my day.',
    'Help me reach my active goal.',
    'What should I focus on today?',
    'Break my project into tasks.',
    'Analyze my productivity and streaks.'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    setInput('');
    setLoading(true);
    try {
      await sendChatMessage(text);
    } catch {
      showToast('Error communicating with AI assistant', 'warning');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[15px] bg-slate-950">
              <Bot className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">NEXA Agent</h2>
              <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            </div>
            <p className="text-xs text-slate-400">
              Personal operating system intelligence with real-time context
            </p>
          </div>
        </div>

        <button
          onClick={clearChatHistory}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition"
          title="Clear Conversation"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Clear</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0 mt-0.5 border border-cyan-500/30">
                <Sparkles className="h-4 w-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-slate-950 font-medium rounded-tr-none shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>

              {/* Inline Action Proposal Card */}
              {msg.proposedAction && msg.proposedAction.status === 'pending' && (
                <div className="mt-3 pt-3 border-t border-slate-800">
                  <ConfirmationCard
                    proposal={{
                      actionType: msg.proposedAction.actionType,
                      title: msg.proposedAction.summary,
                      summary: msg.proposedAction.summary,
                      requiresConfirmation: true,
                      payload: msg.proposedAction.payload
                    }}
                    onConfirm={(customPayload) => {
                      setPendingAction({
                        actionType: msg.proposedAction!.actionType,
                        title: msg.proposedAction!.summary,
                        summary: msg.proposedAction!.summary,
                        requiresConfirmation: true,
                        payload: customPayload || msg.proposedAction!.payload
                      });
                      confirmPendingAction(customPayload || msg.proposedAction!.payload);
                      msg.proposedAction!.status = 'confirmed';
                    }}
                    onCancel={() => {
                      msg.proposedAction!.status = 'cancelled';
                      showToast('Action cancelled', 'info');
                    }}
                  />
                </div>
              )}

              <div
                className={`text-[10px] mt-1 text-right font-mono ${
                  msg.role === 'user' ? 'text-cyan-950/70' : 'text-slate-500'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 text-slate-300 shrink-0 mt-0.5">
                <UserIcon className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0 mt-0.5">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
            <div className="rounded-2xl rounded-tl-none bg-slate-950 border border-slate-800 p-4 text-xs text-slate-400 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
              <span>NEXA is formulating response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[11px] text-slate-500 font-medium shrink-0">Prompts:</span>
        {suggestedPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-slate-800 text-[11px] transition whitespace-nowrap"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-4 bg-slate-950/90 border-t border-slate-800">
        <div className="relative flex items-center rounded-2xl bg-slate-900 border border-slate-800 focus-within:border-cyan-500/50 p-2 transition">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask NEXA to plan, optimize, prioritize, or create..."
            className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none resize-none max-h-32"
          />

          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-sky-300 text-slate-950 hover:from-cyan-300 hover:to-sky-200 disabled:opacity-40 disabled:cursor-not-allowed transition shrink-0"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
