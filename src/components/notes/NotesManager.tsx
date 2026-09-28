import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Note, Category } from '../../types';
import { AIService } from '../../services/aiService';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  CheckSquare,
  FileText,
  Wand2,
  Check,
  Pin,
  Share2,
  Loader2
} from 'lucide-react';

export const NotesManager: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote, addTask, showToast } = useApp();

  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiResultText, setAiResultText] = useState<string | null>(null);

  // Edit/Create form state
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState<Category>('Work');
  const [editTags, setEditTags] = useState('');

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || notes[0];

  const handleStartEdit = (note?: Note) => {
    const target = note || selectedNote;
    if (target) {
      setEditTitle(target.title);
      setEditContent(target.content);
      setEditCategory(target.category);
      setEditTags(target.tags.join(', '));
      setIsEditing(true);
    } else {
      handleCreateNew();
    }
  };

  const handleCreateNew = () => {
    setEditTitle('');
    setEditContent('');
    setEditCategory('Work');
    setEditTags('');
    setSelectedNoteId('');
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    const tagsArray = editTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (selectedNoteId) {
      updateNote(selectedNoteId, {
        title: editTitle.trim(),
        content: editContent,
        category: editCategory,
        tags: tagsArray
      });
    } else {
      const created = addNote({
        title: editTitle.trim(),
        content: editContent,
        category: editCategory,
        tags: tagsArray,
        pinned: false
      });
      setSelectedNoteId(created.id);
    }
    setIsEditing(false);
  };

  const handleAiAction = async (actionType: 'summarize' | 'rewrite' | 'extract_tasks' | 'explain') => {
    if (!selectedNote) return;
    setIsAiProcessing(true);
    setAiResultText(null);

    try {
      if (actionType === 'extract_tasks') {
        const tasks = await AIService.performNoteAction('extract_tasks', selectedNote.content, selectedNote.title);
        if (Array.isArray(tasks) && tasks.length > 0) {
          updateNote(selectedNote.id, { extractedTasks: tasks });
          showToast(`Extracted ${tasks.length} action items from note!`);
        } else {
          showToast('No specific action items detected', 'info');
        }
      } else {
        const result = await AIService.performNoteAction(actionType, selectedNote.content, selectedNote.title);
        setAiResultText(result);
        showToast('AI analysis complete');
      }
    } catch {
      showToast('Failed to process AI note action', 'warning');
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleConvertExtractedTask = (taskText: string) => {
    addTask({
      title: taskText,
      priority: 'high',
      status: 'not_started',
      category: selectedNote?.category || 'Work',
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      subtasks: []
    });
    // Remove from extracted list
    if (selectedNote) {
      const remaining = (selectedNote.extractedTasks || []).filter((t) => t !== taskText);
      updateNote(selectedNote.id, { extractedTasks: remaining });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="h-5 w-5 text-cyan-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Knowledge Repository
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Notes & Action Extraction
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Capture thoughts, summarize concepts, and automatically convert freeform notes into scheduled tasks.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-300 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-cyan-500/20 transition active:scale-95 shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>New Note</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Notes List */}
        <div className="space-y-3">
          {notes.map((note) => {
            const isSelected = selectedNote?.id === note.id;
            return (
              <div
                key={note.id}
                onClick={() => {
                  setSelectedNoteId(note.id);
                  setIsEditing(false);
                  setAiResultText(null);
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition backdrop-blur-md ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500/50 shadow-lg shadow-cyan-950/20 ring-1 ring-cyan-500/30'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {note.category}
                  </span>
                  {note.pinned && <Pin className="h-3.5 w-3.5 text-cyan-400" />}
                </div>

                <h3 className="text-sm font-bold text-white mt-1.5 truncate">
                  {note.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {note.content}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-3 pt-2 border-t border-slate-800/80">
                  <span>{note.updatedAt}</span>
                  {note.extractedTasks && note.extractedTasks.length > 0 && (
                    <span className="text-cyan-400 font-semibold">
                      {note.extractedTasks.length} Action Items
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Note Detail / Editor / AI Actions */}
        <div className="lg:col-span-2 space-y-4">
          {isEditing ? (
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 backdrop-blur-xl space-y-4">
              <h2 className="text-base font-bold text-white">
                {selectedNoteId ? 'Edit Note' : 'Create Note'}
              </h2>
              <form onSubmit={handleSave} className="space-y-3.5">
                <div>
                  <label className="text-xs font-medium text-slate-400">Title</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Note title..."
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-400">Category</label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value as Category)}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Work">Work</option>
                      <option value="Personal">Personal</option>
                      <option value="Study">Study</option>
                      <option value="Health">Health</option>
                      <option value="General">General</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-400">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={editTags}
                      onChange={(e) => setEditTags(e.target.value)}
                      placeholder="e.g. AI, Specs, Priority"
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400">Content (Markdown supported)</label>
                  <textarea
                    rows={8}
                    required
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Write your note, meeting minutes, or ideas here..."
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-300 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20"
                  >
                    Save Note
                  </button>
                </div>
              </form>
            </div>
          ) : selectedNote ? (
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 backdrop-blur-xl space-y-5">
              {/* Note Header & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {selectedNote.category}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      Updated {selectedNote.updatedAt}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    {selectedNote.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStartEdit()}
                    className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl transition"
                    title="Edit Note"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteNote(selectedNote.id)}
                    className="p-2 text-slate-400 hover:text-rose-400 bg-slate-800 rounded-xl transition"
                    title="Delete Note"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* AI Tool Pills Bar */}
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Intelligence Actions
                </span>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => handleAiAction('extract_tasks')}
                    disabled={isAiProcessing}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition"
                  >
                    <CheckSquare className="h-3.5 w-3.5" />
                    <span>Extract Action Items & Tasks</span>
                  </button>

                  <button
                    onClick={() => handleAiAction('summarize')}
                    disabled={isAiProcessing}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-xs font-semibold transition"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>Summarize Note</span>
                  </button>

                  <button
                    onClick={() => handleAiAction('rewrite')}
                    disabled={isAiProcessing}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                  >
                    <Wand2 className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Rewrite / Polish</span>
                  </button>

                  <button
                    onClick={() => handleAiAction('explain')}
                    disabled={isAiProcessing}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                  >
                    <span>Explain Key Concepts</span>
                  </button>
                </div>

                {isAiProcessing && (
                  <div className="flex items-center gap-2 pt-2 text-xs text-cyan-300">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>NEXA is analyzing note content...</span>
                  </div>
                )}
              </div>

              {/* AI Output Window */}
              {aiResultText && (
                <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-slate-200 space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-1 border-b border-cyan-500/20 font-bold text-cyan-300">
                    <span>AI Analysis Result</span>
                    <button
                      onClick={() => setAiResultText(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      Dismiss
                    </button>
                  </div>
                  <div className="whitespace-pre-wrap leading-relaxed">{aiResultText}</div>
                </div>
              )}

              {/* Detected Action Items / Tasks Card */}
              {selectedNote.extractedTasks && selectedNote.extractedTasks.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <CheckSquare className="h-4 w-4 text-cyan-400" />
                      Extracted Action Items ({selectedNote.extractedTasks.length})
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Click to convert into full task
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {selectedNote.extractedTasks.map((taskText, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                      >
                        <span className="truncate pr-2">{taskText}</span>
                        <button
                          onClick={() => handleConvertExtractedTask(taskText)}
                          className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[10px] font-bold border border-cyan-500/30 shrink-0"
                        >
                          + Convert to Task
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Note Content */}
              <div className="prose prose-invert prose-sm max-w-none text-slate-300 whitespace-pre-wrap leading-relaxed font-sans pt-2">
                {selectedNote.content}
              </div>

              {/* Tags footer */}
              {selectedNote.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-800">
                  {selectedNote.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-950 text-slate-400 border border-slate-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400">
              No note selected. Select a note from the left or create a new one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
