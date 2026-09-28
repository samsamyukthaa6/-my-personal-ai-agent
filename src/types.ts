export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type TaskStatus = 'not_started' | 'in_progress' | 'completed';
export type Category = 'Work' | 'Personal' | 'Study' | 'Health' | 'Finance' | 'General';

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  workingHoursStart: string; // e.g. "09:00"
  workingHoursEnd: string;   // e.g. "17:00"
  dailyAvailableHours: number;
  mainGoal: string;
  planningStyle: 'structured' | 'balanced' | 'flexible';
  focusAreas: string[];
  enableAiMemory: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  onboardingCompleted: boolean;
  preferences: UserPreferences;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:MM or 10:00 AM
  category: Category;
  goalId?: string;
  subtasks: Subtask[];
  estimatedMinutes?: number;
  aiPriorityReason?: string;
  createdAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  targetDate?: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: Category;
  targetDate: string; // YYYY-MM-DD
  progress: number; // 0 - 100
  status: 'active' | 'completed' | 'paused';
  milestones: Milestone[];
  color?: string;
  createdAt: string;
}

export interface Habit {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: Category;
  frequency: 'daily' | 'weekdays' | 'weekly';
  targetCount: number;
  unit: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime';
  currentStreak: number;
  longestStreak: number;
  completedDates: string[]; // YYYY-MM-DD
  color: string;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startDate: string; // ISO string or YYYY-MM-DDTHH:mm
  endDate: string;
  allDay?: boolean;
  type: 'event' | 'meeting' | 'study' | 'task_deadline' | 'habit' | 'reminder';
  category: Category;
  location?: string;
  color?: string;
}

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  dueDate: string;
  time?: string;
  priority: Priority;
  completed: boolean;
  category?: Category;
  createdAt: string;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  category: Category;
  pinned: boolean;
  extractedTasks?: string[];
  updatedAt: string;
}

export interface PracticeQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface StudyDay {
  day: number;
  date: string;
  topic: string;
  subtopics: string[];
  hours: number;
  completed: boolean;
  practiceQuestions?: PracticeQuestion[];
}

export interface StudyPlan {
  id: string;
  userId: string;
  subject: string;
  examDate: string;
  targetScore: string;
  knowledgeLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  dailyHours: number;
  roadmap: StudyDay[];
  weakTopics: string[];
  studyTips: string[];
  createdAt: string;
}

export interface TimeBlock {
  id: string;
  time: string; // e.g. "09:00 - 10:30"
  title: string;
  durationMinutes: number;
  category: Category | 'Break';
  source: 'task' | 'habit' | 'event' | 'break' | 'study';
  completed: boolean;
  referenceId?: string;
}

export interface DailyPlan {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  timeBlocks: TimeBlock[];
  aiNotes: string;
  generatedAt: string;
}

export interface UserMemory {
  id: string;
  userId: string;
  category: 'preference' | 'work_habit' | 'learning_style' | 'routine' | 'goal_context';
  key: string;
  value: string;
  enabled: boolean;
  createdAt: string;
}

export interface AIRecommendation {
  id: string;
  userId: string;
  title: string;
  description: string;
  actionType: 'create_study' | 'reschedule_task' | 'habit_nudge' | 'goal_checkin' | 'daily_plan' | 'break_task';
  priority: 'high' | 'medium' | 'low';
  actionLabel?: string;
  payload: any;
  status: 'pending' | 'applied' | 'dismissed';
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'task' | 'habit' | 'goal' | 'event' | 'ai' | 'system';
  read: boolean;
  timestamp: string;
  linkTab?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  proposedAction?: {
    actionType: string;
    summary: string;
    payload: any;
    status: 'pending' | 'confirmed' | 'cancelled';
  };
}

export interface ActionProposal {
  actionType: string;
  title: string;
  summary: string;
  requiresConfirmation: boolean;
  payload: any;
  explanation?: string;
}
