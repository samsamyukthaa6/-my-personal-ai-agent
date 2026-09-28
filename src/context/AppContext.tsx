import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Task,
  Goal,
  Habit,
  CalendarEvent,
  Reminder,
  Note,
  StudyPlan,
  DailyPlan,
  UserMemory,
  AIRecommendation,
  Notification,
  ChatMessage,
  ActionProposal,
  Priority,
  Category,
  TaskStatus
} from '../types';
import { useAuth } from './AuthContext';
import { loadUserData, saveUserData, getTodayStr } from '../services/storage';
import { AIService } from '../services/aiService';

interface AppContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  // State
  tasks: Task[];
  goals: Goal[];
  habits: Habit[];
  events: CalendarEvent[];
  reminders: Reminder[];
  notes: Note[];
  studyPlans: StudyPlan[];
  dailyPlan: DailyPlan | null;
  memories: UserMemory[];
  recommendations: AIRecommendation[];
  notifications: Notification[];
  chatMessages: ChatMessage[];
  unreadNotifsCount: number;
  
  // Pending Confirmation System
  pendingAction: ActionProposal | null;
  setPendingAction: (action: ActionProposal | null) => void;
  confirmPendingAction: (customPayload?: any) => Promise<boolean>;
  cancelPendingAction: () => void;

  // Task Operations
  addTask: (task: Omit<Task, 'id' | 'userId' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  breakdownTaskWithAI: (id: string) => Promise<void>;
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;

  // Goal Operations
  addGoal: (goal: Omit<Goal, 'id' | 'userId' | 'createdAt'>) => Goal;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  generateGoalPlanAI: (goalId: string) => Promise<void>;

  // Habit Operations
  addHabit: (habit: Omit<Habit, 'id' | 'userId' | 'createdAt' | 'currentStreak' | 'longestStreak' | 'completedDates'>) => Habit;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitDate: (habitId: string, dateStr?: string) => void;

  // Calendar & Event Operations
  addEvent: (event: Omit<CalendarEvent, 'id' | 'userId'>) => CalendarEvent;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;

  // Reminder Operations
  addReminder: (reminder: Omit<Reminder, 'id' | 'userId' | 'createdAt'>) => Reminder;
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;

  // Notes Operations
  addNote: (note: Omit<Note, 'id' | 'userId' | 'updatedAt'>) => Note;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  extractTasksFromNote: (noteId: string) => Promise<string[]>;

  // Study Planner Operations
  createStudyPlanAI: (params: { subject: string; examDate: string; knowledgeLevel: string; dailyHours: number; targetScore: string }) => Promise<StudyPlan>;
  toggleStudyDay: (planId: string, dayNumber: number) => void;

  // Daily Planner
  generateDailyPlanAI: () => Promise<void>;
  toggleTimeBlock: (blockId: string) => void;

  // Memory Operations
  addMemory: (mem: Omit<UserMemory, 'id' | 'userId' | 'createdAt'>) => void;
  updateMemory: (id: string, updates: Partial<UserMemory>) => void;
  deleteMemory: (id: string) => void;
  toggleMemoryEnabled: (id: string) => void;

  // Recommendations Operations
  handleRecommendation: (id: string, decision: 'do_it' | 'later' | 'dismiss') => Promise<void>;
  refreshRecommendations: () => Promise<void>;

  // Notifications Operations
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;

  // Chat Assistant
  sendChatMessage: (content: string) => Promise<void>;
  clearChatHistory: () => void;

  // Toast feedback
  toast: { message: string; type: 'success' | 'info' | 'warning' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;

  // Global Search
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Core Data
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null);
  const [memories, setMemories] = useState<UserMemory[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Pending Command Confirmation
  const [pendingAction, setPendingAction] = useState<ActionProposal | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Load user data on user switch
  useEffect(() => {
    if (!currentUser) {
      setTasks([]);
      setGoals([]);
      setHabits([]);
      setEvents([]);
      setReminders([]);
      setNotes([]);
      setStudyPlans([]);
      setDailyPlan(null);
      setMemories([]);
      setRecommendations([]);
      setNotifications([]);
      setChatMessages([]);
      return;
    }

    const data = loadUserData(currentUser.id);
    setTasks(data.tasks || []);
    setGoals(data.goals || []);
    setHabits(data.habits || []);
    setEvents(data.events || []);
    setReminders(data.reminders || []);
    setNotes(data.notes || []);
    setStudyPlans(data.studyPlans || []);
    setDailyPlan(data.dailyPlan || null);
    setMemories(data.memories || []);
    setRecommendations(data.recommendations || []);
    setNotifications(data.notifications || []);
    setChatMessages(data.chatMessages || []);
  }, [currentUser?.id]);

  // Synchronize with Local Storage
  const persistState = (partialUpdates?: any) => {
    if (!currentUser) return;
    const currentStore = {
      tasks: partialUpdates?.tasks ?? tasks,
      goals: partialUpdates?.goals ?? goals,
      habits: partialUpdates?.habits ?? habits,
      events: partialUpdates?.events ?? events,
      reminders: partialUpdates?.reminders ?? reminders,
      notes: partialUpdates?.notes ?? notes,
      studyPlans: partialUpdates?.studyPlans ?? studyPlans,
      dailyPlan: partialUpdates?.dailyPlan ?? dailyPlan,
      memories: partialUpdates?.memories ?? memories,
      recommendations: partialUpdates?.recommendations ?? recommendations,
      notifications: partialUpdates?.notifications ?? notifications,
      chatMessages: partialUpdates?.chatMessages ?? chatMessages,
    };
    saveUserData(currentUser.id, currentStore);
  };

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  // --- Task Methods ---
  const addTask = (taskData: Omit<Task, 'id' | 'userId' | 'createdAt'>): Task => {
    if (!currentUser) throw new Error('Unauthenticated');
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      userId: currentUser.id,
      createdAt: getTodayStr(),
      subtasks: taskData.subtasks || [],
      aiPriorityReason: taskData.aiPriorityReason || (
        taskData.priority === 'critical' ? 'Marked critical: Immediate focus required.' :
        taskData.priority === 'high' ? 'High impact milestone with upcoming target.' :
        'Scheduled according to your regular priority cadence.'
      )
    };
    const nextTasks = [newTask, ...tasks];
    setTasks(nextTasks);
    persistState({ tasks: nextTasks });
    showToast(`Task created: "${newTask.title}"`);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const nextTasks = tasks.map(t => (t.id === id ? { ...t, ...updates } : t));
    setTasks(nextTasks);
    persistState({ tasks: nextTasks });
  };

  const deleteTask = (id: string) => {
    const nextTasks = tasks.filter(t => t.id !== id);
    setTasks(nextTasks);
    persistState({ tasks: nextTasks });
    showToast('Task deleted', 'info');
  };

  const toggleTaskStatus = (id: string) => {
    const nextTasks: Task[] = tasks.map(t => {
      if (t.id === id) {
        const nextStatus: TaskStatus = t.status === 'completed' ? 'in_progress' : 'completed';
        return { ...t, status: nextStatus };
      }
      return t;
    });
    setTasks(nextTasks);
    persistState({ tasks: nextTasks });
  };

  const breakdownTaskWithAI = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    showToast('NEXA is breaking down task into subtasks...', 'info');
    try {
      const subtaskTitles = await AIService.breakdownTask(task.title, task.description);
      const newSubtasks = subtaskTitles.map((title, idx) => ({
        id: `st-${Date.now()}-${idx}`,
        title,
        completed: false
      }));
      updateTask(id, { subtasks: [...task.subtasks, ...newSubtasks] });
      showToast(`Added ${newSubtasks.length} AI-generated subtasks!`);
    } catch {
      showToast('Could not complete AI breakdown', 'warning');
    }
  };

  const addSubtask = (taskId: string, title: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const newSt = { id: `st-${Date.now()}`, title: title.trim(), completed: false };
    updateTask(taskId, { subtasks: [...task.subtasks, newSt] });
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const updatedSubtasks = task.subtasks.map(st =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    updateTask(taskId, { subtasks: updatedSubtasks });
  };

  // --- Goal Methods ---
  const addGoal = (goalData: Omit<Goal, 'id' | 'userId' | 'createdAt'>): Goal => {
    if (!currentUser) throw new Error('Unauthenticated');
    const newGoal: Goal = {
      ...goalData,
      id: `goal-${Date.now()}`,
      userId: currentUser.id,
      createdAt: getTodayStr(),
      progress: goalData.progress || 0,
      status: goalData.status || 'active',
      milestones: goalData.milestones || []
    };
    const nextGoals = [newGoal, ...goals];
    setGoals(nextGoals);
    persistState({ goals: nextGoals });
    showToast(`Goal established: "${newGoal.title}"`);
    return newGoal;
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    const nextGoals = goals.map(g => (g.id === id ? { ...g, ...updates } : g));
    setGoals(nextGoals);
    persistState({ goals: nextGoals });
  };

  const deleteGoal = (id: string) => {
    const nextGoals = goals.filter(g => g.id !== id);
    setGoals(nextGoals);
    persistState({ goals: nextGoals });
    showToast('Goal removed', 'info');
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    const updatedMilestones = goal.milestones.map(m =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    const completedCount = updatedMilestones.filter(m => m.completed).length;
    const newProgress = updatedMilestones.length > 0
      ? Math.round((completedCount / updatedMilestones.length) * 100)
      : goal.progress;

    updateGoal(goalId, { milestones: updatedMilestones, progress: newProgress });
  };

  const generateGoalPlanAI = async (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    showToast('NEXA is formulating AI milestone roadmap...', 'info');
    try {
      const plan = await AIService.generateGoalPlan(goal.title, goal.description, goal.targetDate, goal.category);
      const newMilestones = plan.milestones?.map((m: any, idx: number) => ({
        id: `ms-${Date.now()}-${idx}`,
        title: m.title,
        targetDate: goal.targetDate,
        completed: false
      })) || [];

      updateGoal(goalId, {
        milestones: [...goal.milestones, ...newMilestones]
      });

      // Also add suggested tasks
      if (plan.suggestedTasks?.length && currentUser) {
        plan.suggestedTasks.forEach((t: any) => {
          addTask({
            title: t.title,
            priority: t.priority || 'high',
            status: 'not_started',
            dueDate: goal.targetDate,
            category: goal.category,
            goalId: goal.id,
            subtasks: []
          });
        });
      }
      showToast('AI Goal Plan & Milestones added!');
    } catch {
      showToast('Failed to generate goal plan', 'warning');
    }
  };

  // --- Habit Methods ---
  const addHabit = (habitData: Omit<Habit, 'id' | 'userId' | 'createdAt' | 'currentStreak' | 'longestStreak' | 'completedDates'>): Habit => {
    if (!currentUser) throw new Error('Unauthenticated');
    const newHabit: Habit = {
      ...habitData,
      id: `habit-${Date.now()}`,
      userId: currentUser.id,
      currentStreak: 0,
      longestStreak: 0,
      completedDates: [],
      createdAt: getTodayStr()
    };
    const nextHabits = [...habits, newHabit];
    setHabits(nextHabits);
    persistState({ habits: nextHabits });
    showToast(`Habit created: "${newHabit.title}"`);
    return newHabit;
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    const nextHabits = habits.map(h => (h.id === id ? { ...h, ...updates } : h));
    setHabits(nextHabits);
    persistState({ habits: nextHabits });
  };

  const deleteHabit = (id: string) => {
    const nextHabits = habits.filter(h => h.id !== id);
    setHabits(nextHabits);
    persistState({ habits: nextHabits });
    showToast('Habit removed', 'info');
  };

  const toggleHabitDate = (habitId: string, dateStr: string = getTodayStr()) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const exists = habit.completedDates.includes(dateStr);
    let nextDates = exists
      ? habit.completedDates.filter(d => d !== dateStr)
      : [...habit.completedDates, dateStr];

    // Recalculate streak
    const newStreak = exists ? Math.max(0, habit.currentStreak - 1) : habit.currentStreak + 1;
    const newLongest = Math.max(habit.longestStreak, newStreak);

    updateHabit(habitId, {
      completedDates: nextDates,
      currentStreak: newStreak,
      longestStreak: newLongest
    });

    if (!exists) {
      showToast(`Logged "${habit.title}"! 🔥 Streak: ${newStreak} days`);
    }
  };

  // --- Calendar Event Methods ---
  const addEvent = (eventData: Omit<CalendarEvent, 'id' | 'userId'>): CalendarEvent => {
    if (!currentUser) throw new Error('Unauthenticated');
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
      userId: currentUser.id
    };
    const nextEvents = [...events, newEvent];
    setEvents(nextEvents);
    persistState({ events: nextEvents });
    showToast(`Event added: "${newEvent.title}"`);
    return newEvent;
  };

  const updateEvent = (id: string, updates: Partial<CalendarEvent>) => {
    const nextEvents = events.map(e => (e.id === id ? { ...e, ...updates } : e));
    setEvents(nextEvents);
    persistState({ events: nextEvents });
  };

  const deleteEvent = (id: string) => {
    const nextEvents = events.filter(e => e.id !== id);
    setEvents(nextEvents);
    persistState({ events: nextEvents });
    showToast('Event deleted', 'info');
  };

  // --- Reminder Methods ---
  const addReminder = (remData: Omit<Reminder, 'id' | 'userId' | 'createdAt'>): Reminder => {
    if (!currentUser) throw new Error('Unauthenticated');
    const newRem: Reminder = {
      ...remData,
      id: `rem-${Date.now()}`,
      userId: currentUser.id,
      createdAt: getTodayStr()
    };
    const nextReminders = [newRem, ...reminders];
    setReminders(nextReminders);
    persistState({ reminders: nextReminders });
    showToast(`Reminder set: "${newRem.title}"`);
    return newRem;
  };

  const toggleReminder = (id: string) => {
    const nextRem = reminders.map(r => (r.id === id ? { ...r, completed: !r.completed } : r));
    setReminders(nextRem);
    persistState({ reminders: nextRem });
  };

  const deleteReminder = (id: string) => {
    const nextRem = reminders.filter(r => r.id !== id);
    setReminders(nextRem);
    persistState({ reminders: nextRem });
  };

  // --- Notes Methods ---
  const addNote = (noteData: Omit<Note, 'id' | 'userId' | 'updatedAt'>): Note => {
    if (!currentUser) throw new Error('Unauthenticated');
    const newNote: Note = {
      ...noteData,
      id: `note-${Date.now()}`,
      userId: currentUser.id,
      updatedAt: getTodayStr()
    };
    const nextNotes = [newNote, ...notes];
    setNotes(nextNotes);
    persistState({ notes: nextNotes });
    showToast(`Note saved: "${newNote.title}"`);
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    const nextNotes = notes.map(n =>
      n.id === id ? { ...n, ...updates, updatedAt: getTodayStr() } : n
    );
    setNotes(nextNotes);
    persistState({ notes: nextNotes });
  };

  const deleteNote = (id: string) => {
    const nextNotes = notes.filter(n => n.id !== id);
    setNotes(nextNotes);
    persistState({ notes: nextNotes });
    showToast('Note deleted', 'info');
  };

  const extractTasksFromNote = async (noteId: string): Promise<string[]> => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return [];
    showToast('NEXA is extracting action items from note...', 'info');
    try {
      const extracted = await AIService.performNoteAction('extract_tasks', note.content, note.title);
      if (Array.isArray(extracted) && extracted.length > 0) {
        updateNote(noteId, { extractedTasks: extracted });
        showToast(`Extracted ${extracted.length} action items!`);
        return extracted;
      }
      return [];
    } catch {
      showToast('Could not extract tasks', 'warning');
      return [];
    }
  };

  // --- Study Planner Methods ---
  const createStudyPlanAI = async (params: {
    subject: string;
    examDate: string;
    knowledgeLevel: string;
    dailyHours: number;
    targetScore: string;
  }): Promise<StudyPlan> => {
    if (!currentUser) throw new Error('Unauthenticated');
    showToast(`Generating personalized roadmap for ${params.subject}...`, 'info');
    const plan = await AIService.generateStudyPlan(params);
    plan.userId = currentUser.id;
    const nextPlans = [plan, ...studyPlans];
    setStudyPlans(nextPlans);
    persistState({ studyPlans: nextPlans });
    showToast(`Study Roadmap generated for ${params.subject}!`);
    return plan;
  };

  const toggleStudyDay = (planId: string, dayNumber: number) => {
    const plan = studyPlans.find(p => p.id === planId);
    if (!plan) return;
    const updatedRoadmap = plan.roadmap.map(d =>
      d.day === dayNumber ? { ...d, completed: !d.completed } : d
    );
    const nextPlans = studyPlans.map(p =>
      p.id === planId ? { ...p, roadmap: updatedRoadmap } : p
    );
    setStudyPlans(nextPlans);
    persistState({ studyPlans: nextPlans });
  };

  // --- Daily Planner Methods ---
  const generateDailyPlanAI = async () => {
    if (!currentUser) return;
    showToast('NEXA is organizing your optimal daily schedule...', 'info');
    try {
      const generated = await AIService.generateDailyPlan(
        tasks.filter(t => t.status !== 'completed'),
        habits,
        events,
        currentUser.preferences
      );
      generated.userId = currentUser.id;
      setDailyPlan(generated);
      persistState({ dailyPlan: generated });
      showToast('Generated optimal schedule for today!');
    } catch {
      showToast('Failed to generate daily schedule', 'warning');
    }
  };

  const toggleTimeBlock = (blockId: string) => {
    if (!dailyPlan) return;
    const updatedBlocks = dailyPlan.timeBlocks.map(tb =>
      tb.id === blockId ? { ...tb, completed: !tb.completed } : tb
    );
    const updated = { ...dailyPlan, timeBlocks: updatedBlocks };
    setDailyPlan(updated);
    persistState({ dailyPlan: updated });
  };

  // --- Memory Methods ---
  const addMemory = (memData: Omit<UserMemory, 'id' | 'userId' | 'createdAt'>) => {
    if (!currentUser) return;
    const newMem: UserMemory = {
      ...memData,
      id: `mem-${Date.now()}`,
      userId: currentUser.id,
      createdAt: getTodayStr()
    };
    const nextMem = [...memories, newMem];
    setMemories(nextMem);
    persistState({ memories: nextMem });
    showToast('Saved to NEXA memory');
  };

  const updateMemory = (id: string, updates: Partial<UserMemory>) => {
    const nextMem = memories.map(m => (m.id === id ? { ...m, ...updates } : m));
    setMemories(nextMem);
    persistState({ memories: nextMem });
  };

  const deleteMemory = (id: string) => {
    const nextMem = memories.filter(m => m.id !== id);
    setMemories(nextMem);
    persistState({ memories: nextMem });
    showToast('Memory forgotten', 'info');
  };

  const toggleMemoryEnabled = (id: string) => {
    const mem = memories.find(m => m.id === id);
    if (!mem) return;
    updateMemory(id, { enabled: !mem.enabled });
  };

  // --- Recommendations ---
  const handleRecommendation = async (id: string, decision: 'do_it' | 'later' | 'dismiss') => {
    const rec = recommendations.find(r => r.id === id);
    if (!rec) return;

    if (decision === 'do_it') {
      if (rec.actionType === 'daily_plan') {
        await generateDailyPlanAI();
        setActiveTab('planner');
      } else if (rec.actionType === 'create_study') {
        setActiveTab('study');
      } else if (rec.actionType === 'habit_nudge') {
        const hId = rec.payload?.habitId || habits[0]?.id;
        if (hId) toggleHabitDate(hId);
      } else if (rec.actionType === 'goal_checkin') {
        setActiveTab('goals');
      }
      showToast(`Action applied: ${rec.title}`);
    }

    const nextRecs = recommendations.map(r =>
      r.id === id ? { ...r, status: decision === 'do_it' ? 'applied' : 'dismissed' } : r
    ) as AIRecommendation[];
    setRecommendations(nextRecs);
    persistState({ recommendations: nextRecs });
  };

  const refreshRecommendations = async () => {
    showToast('Analyzing priorities for new recommendations...', 'info');
    const fresh = await AIService.fetchRecommendations(tasks, goals, habits);
    if (fresh.length > 0 && currentUser) {
      const mapped = fresh.map((r: any, idx: number) => ({
        ...r,
        id: `rec-fresh-${Date.now()}-${idx}`,
        userId: currentUser.id,
        status: 'pending',
        createdAt: getTodayStr()
      }));
      setRecommendations(mapped);
      persistState({ recommendations: mapped });
      showToast('Fresh AI recommendations loaded!');
    }
  };

  // --- Notifications ---
  const markNotificationRead = (id: string) => {
    const nextN = notifications.map(n => (n.id === id ? { ...n, read: true } : n));
    setNotifications(nextN);
    persistState({ notifications: nextN });
  };

  const markAllNotificationsRead = () => {
    const nextN = notifications.map(n => ({ ...n, read: true }));
    setNotifications(nextN);
    persistState({ notifications: nextN });
  };

  const deleteNotification = (id: string) => {
    const nextN = notifications.filter(n => n.id !== id);
    setNotifications(nextN);
    persistState({ notifications: nextN });
  };

  // --- Chat Assistant ---
  const sendChatMessage = async (content: string) => {
    if (!currentUser) return;
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const nextMessages = [...chatMessages, userMsg];
    setChatMessages(nextMessages);

    try {
      const response = await AIService.sendChatMessage(
        nextMessages.map(m => ({ role: m.role, content: m.content })),
        { tasks, goals, habits, memories: memories.filter(m => m.enabled) }
      );

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        proposedAction: response.proposedAction ? {
          ...response.proposedAction,
          status: 'pending'
        } : undefined
      };

      const finalMessages = [...nextMessages, assistantMsg];
      setChatMessages(finalMessages);
      persistState({ chatMessages: finalMessages });
    } catch {
      showToast('Error communicating with AI assistant', 'warning');
    }
  };

  const clearChatHistory = () => {
    setChatMessages([]);
    persistState({ chatMessages: [] });
    showToast('Conversation cleared', 'info');
  };

  // --- Confirmation System ---
  const confirmPendingAction = async (customPayload?: any): Promise<boolean> => {
    if (!pendingAction || !currentUser) return false;
    const payload = customPayload || pendingAction.payload || {};

    try {
      switch (pendingAction.actionType) {
        case 'create_task':
          addTask({
            title: payload.title || pendingAction.title,
            description: payload.description || '',
            priority: (payload.priority as Priority) || 'medium',
            status: 'not_started',
            dueDate: payload.dueDate || getTodayStr(),
            category: (payload.category as Category) || 'Work',
            subtasks: (payload.subtasks || []).map((t: string, idx: number) => ({
              id: `st-${Date.now()}-${idx}`,
              title: t,
              completed: false
            }))
          });
          break;

        case 'create_reminder':
          addReminder({
            title: payload.title || pendingAction.title,
            dueDate: payload.dueDate || getTodayStr(),
            time: payload.time || '09:00 AM',
            priority: (payload.priority as Priority) || 'high',
            completed: false,
            category: (payload.category as Category) || 'Personal'
          });
          break;

        case 'create_event':
          addEvent({
            title: payload.title || pendingAction.title,
            startDate: payload.startDate || `${getTodayStr()}T09:00`,
            endDate: payload.endDate || `${getTodayStr()}T10:00`,
            type: 'event',
            category: (payload.category as Category) || 'Work',
            location: payload.location || ''
          });
          break;

        case 'create_goal':
          addGoal({
            title: payload.title || pendingAction.title,
            description: payload.description || '',
            category: (payload.category as Category) || 'Work',
            targetDate: payload.targetDate || getTodayStr(),
            progress: 0,
            status: 'active',
            milestones: []
          });
          break;

        case 'create_habit':
          addHabit({
            title: payload.title || pendingAction.title,
            description: payload.description || '',
            category: (payload.category as Category) || 'Health',
            frequency: 'daily',
            targetCount: 1,
            unit: 'times',
            timeOfDay: 'morning',
            color: '#00d2ff'
          });
          break;

        case 'create_note':
          addNote({
            title: payload.title || pendingAction.title,
            content: payload.content || '',
            tags: payload.tags || ['Quick Note'],
            category: (payload.category as Category) || 'General',
            pinned: false
          });
          break;

        case 'generate_daily_plan':
          await generateDailyPlanAI();
          setActiveTab('planner');
          break;

        case 'create_study_plan':
          await createStudyPlanAI({
            subject: payload.subject || pendingAction.title,
            examDate: payload.examDate || getTodayStr(),
            knowledgeLevel: payload.knowledgeLevel || 'Intermediate',
            dailyHours: payload.dailyHours || 2,
            targetScore: payload.targetScore || '90%+'
          });
          setActiveTab('study');
          break;

        default:
          showToast(`Executed action: ${pendingAction.actionType}`);
          break;
      }

      setPendingAction(null);
      return true;
    } catch (err: any) {
      showToast(`Action failed: ${err.message}`, 'warning');
      return false;
    }
  };

  const cancelPendingAction = () => {
    setPendingAction(null);
    showToast('Action cancelled', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        tasks,
        goals,
        habits,
        events,
        reminders,
        notes,
        studyPlans,
        dailyPlan,
        memories,
        recommendations,
        notifications,
        chatMessages,
        unreadNotifsCount,

        pendingAction,
        setPendingAction,
        confirmPendingAction,
        cancelPendingAction,

        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        breakdownTaskWithAI,
        addSubtask,
        toggleSubtask,

        addGoal,
        updateGoal,
        deleteGoal,
        toggleMilestone,
        generateGoalPlanAI,

        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabitDate,

        addEvent,
        updateEvent,
        deleteEvent,

        addReminder,
        toggleReminder,
        deleteReminder,

        addNote,
        updateNote,
        deleteNote,
        extractTasksFromNote,

        createStudyPlanAI,
        toggleStudyDay,

        generateDailyPlanAI,
        toggleTimeBlock,

        addMemory,
        updateMemory,
        deleteMemory,
        toggleMemoryEnabled,

        handleRecommendation,
        refreshRecommendations,

        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,

        sendChatMessage,
        clearChatHistory,

        toast,
        showToast,

        isSearchOpen,
        setIsSearchOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
