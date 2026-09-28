import {
  User,
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
  Category,
  Priority
} from '../types';

export interface UserDataStore {
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
}

const USERS_KEY = 'nexa_users';
const CURRENT_USER_KEY = 'nexa_active_user_id';
const DATA_PREFIX = 'nexa_data_';

// Helper for formatted dates
export function getTodayStr(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

export function getRelativeDateStr(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
}

// Generate Realistic Demo Data
export function createDemoData(userId: string): UserDataStore {
  const today = getTodayStr();
  const tomorrow = getRelativeDateStr(1);
  const in3Days = getRelativeDateStr(3);
  const in5Days = getRelativeDateStr(5);
  const in10Days = getRelativeDateStr(10);
  const in30Days = getRelativeDateStr(30);

  const goal1Id = 'goal-startup';
  const goal2Id = 'goal-python';
  const goal3Id = 'goal-fitness';

  const goals: Goal[] = [
    {
      id: goal1Id,
      userId,
      title: 'Launch NEXA AI SaaS MVP',
      description: 'Design, architect, and launch an AI-powered personal productivity platform with Gemini AI integration.',
      category: 'Work',
      targetDate: in30Days,
      progress: 68,
      status: 'active',
      color: '#00d2ff',
      milestones: [
        { id: 'm-1', title: 'Interactive Agent Prototype & Command System', targetDate: today, completed: true },
        { id: 'm-2', title: 'Smart Planner & Task Decomposition Engine', targetDate: tomorrow, completed: true },
        { id: 'm-3', title: 'Study Mode & Quiz Roadmaps', targetDate: in5Days, completed: false },
        { id: 'm-4', title: 'Beta User Onboarding & Feedback Cycle', targetDate: in10Days, completed: false }
      ],
      createdAt: getRelativeDateStr(-14)
    },
    {
      id: goal2Id,
      userId,
      title: 'Master Machine Learning & Python',
      description: 'Complete hands-on deep learning projects, neural network foundations, and agent orchestration.',
      category: 'Study',
      targetDate: in30Days,
      progress: 52,
      status: 'active',
      color: '#8b5cf6',
      milestones: [
        { id: 'm-21', title: 'Review Linear Algebra & Gradient Descent', targetDate: getRelativeDateStr(-2), completed: true },
        { id: 'm-22', title: 'Build Multi-Agent Orchestrator in Python', targetDate: in3Days, completed: false },
        { id: 'm-23', title: 'Deploy Fine-tuned Model Inference Endpoint', targetDate: in10Days, completed: false }
      ],
      createdAt: getRelativeDateStr(-20)
    },
    {
      id: goal3Id,
      userId,
      title: 'Run 10km Marathon & Peak Conditioning',
      description: 'Build cardiovascular endurance, weekly interval sprints, and optimize sleep/recovery metrics.',
      category: 'Health',
      targetDate: in30Days,
      progress: 40,
      status: 'active',
      color: '#10b981',
      milestones: [
        { id: 'm-31', title: 'Sustain 5km non-stop pace under 27 mins', targetDate: getRelativeDateStr(-5), completed: true },
        { id: 'm-32', title: 'Complete 8km trial run with negative split', targetDate: in5Days, completed: false },
        { id: 'm-33', title: 'Official 10km Race Day execution', targetDate: in30Days, completed: false }
      ],
      createdAt: getRelativeDateStr(-10)
    }
  ];

  const tasks: Task[] = [
    {
      id: 'task-1',
      userId,
      title: 'Finalize NEXA Smart Priority Engine & UX audit',
      description: 'Audit priority weights, check mobile touch targets, and refine electric-blue glassmorphic styling.',
      priority: 'critical',
      status: 'in_progress',
      dueDate: today,
      dueTime: '17:00',
      category: 'Work',
      goalId: goal1Id,
      estimatedMinutes: 90,
      aiPriorityReason: 'Due today and directly connected to active milestone for Launch NEXA AI SaaS MVP.',
      subtasks: [
        { id: 'st-1', title: 'Validate priority score algorithms', completed: true },
        { id: 'st-2', title: 'Refine responsive mobile navigation drawer', completed: true },
        { id: 'st-3', title: 'Run cross-browser accessibility checklist', completed: false }
      ],
      createdAt: getRelativeDateStr(-1)
    },
    {
      id: 'task-2',
      userId,
      title: 'Prepare Python ML Project presentation deck',
      description: 'Summarize agent architecture, vector similarity search metrics, and benchmark results for Friday review.',
      priority: 'high',
      status: 'not_started',
      dueDate: tomorrow,
      dueTime: '11:00',
      category: 'Study',
      goalId: goal2Id,
      estimatedMinutes: 60,
      aiPriorityReason: 'Upcoming deadline tomorrow; crucial deliverable for Master Machine Learning goal.',
      subtasks: [
        { id: 'st-21', title: 'Extract latency and token throughput charts', completed: false },
        { id: 'st-22', title: 'Synthesize 5 key architecture slides', completed: false },
        { id: 'st-23', title: 'Rehearse 10-minute presentation', completed: false }
      ],
      createdAt: getRelativeDateStr(-2)
    },
    {
      id: 'task-3',
      userId,
      title: 'Call Arun to align on API schemas and deployment',
      description: 'Review webhook contracts, token refresh timeouts, and database index configurations.',
      priority: 'high',
      status: 'not_started',
      dueDate: tomorrow,
      dueTime: '10:00 AM',
      category: 'Work',
      estimatedMinutes: 30,
      aiPriorityReason: 'Blocker for backend integration. Recommended for early morning slot.',
      subtasks: [
        { id: 'st-31', title: 'Draft schema questions', completed: true },
        { id: 'st-32', title: '30-minute sync call', completed: false }
      ],
      createdAt: getRelativeDateStr(-1)
    },
    {
      id: 'task-4',
      userId,
      title: 'Morning 6km interval training run',
      description: 'Warm-up 1km, 4x 800m fast intervals, cool-down walk and post-run hydration.',
      priority: 'medium',
      status: 'completed',
      dueDate: today,
      category: 'Health',
      goalId: goal3Id,
      estimatedMinutes: 45,
      aiPriorityReason: 'Supports athletic conditioning goal; best executed during morning energy peak.',
      subtasks: [
        { id: 'st-41', title: 'Warm-up stretches', completed: true },
        { id: 'st-42', title: 'Complete intervals', completed: true }
      ],
      createdAt: getRelativeDateStr(-1)
    },
    {
      id: 'task-5',
      userId,
      title: 'Review weekly budget & cloud infrastructure costs',
      description: 'Analyze token spend, Cloud Run resource utilization, and scale-to-zero limits.',
      priority: 'low',
      status: 'not_started',
      dueDate: in3Days,
      category: 'Finance',
      estimatedMinutes: 40,
      aiPriorityReason: 'Routine weekly governance check. Low urgency today.',
      subtasks: [],
      createdAt: getRelativeDateStr(-3)
    }
  ];

  const habits: Habit[] = [
    {
      id: 'habit-code',
      userId,
      title: 'Deep Coding & Architecture',
      description: 'At least 90 minutes of uninterrupted flow state development.',
      category: 'Work',
      frequency: 'daily',
      targetCount: 1,
      unit: 'sessions',
      timeOfDay: 'morning',
      currentStreak: 12,
      longestStreak: 21,
      completedDates: [
        getRelativeDateStr(-4),
        getRelativeDateStr(-3),
        getRelativeDateStr(-2),
        getRelativeDateStr(-1),
        today
      ],
      color: '#00d2ff',
      createdAt: getRelativeDateStr(-30)
    },
    {
      id: 'habit-study',
      userId,
      title: 'Daily Technical Reading & Notes',
      description: 'Read 20 pages or paper on distributed AI systems.',
      category: 'Study',
      frequency: 'daily',
      targetCount: 20,
      unit: 'pages',
      timeOfDay: 'evening',
      currentStreak: 8,
      longestStreak: 15,
      completedDates: [
        getRelativeDateStr(-3),
        getRelativeDateStr(-2),
        getRelativeDateStr(-1)
      ],
      color: '#8b5cf6',
      createdAt: getRelativeDateStr(-20)
    },
    {
      id: 'habit-hydration',
      userId,
      title: 'Hydration & Electrolytes',
      description: 'Drink 2.5 Liters of pure water throughout the day.',
      category: 'Health',
      frequency: 'daily',
      targetCount: 2500,
      unit: 'ml',
      timeOfDay: 'anytime',
      currentStreak: 19,
      longestStreak: 25,
      completedDates: [
        getRelativeDateStr(-5),
        getRelativeDateStr(-4),
        getRelativeDateStr(-3),
        getRelativeDateStr(-2),
        getRelativeDateStr(-1),
        today
      ],
      color: '#06b6d4',
      createdAt: getRelativeDateStr(-25)
    },
    {
      id: 'habit-meditation',
      userId,
      title: 'Mindfulness & Mental Reset',
      description: '10-minute box breathing meditation to reduce cognitive fatigue.',
      category: 'Health',
      frequency: 'daily',
      targetCount: 10,
      unit: 'mins',
      timeOfDay: 'morning',
      currentStreak: 5,
      longestStreak: 14,
      completedDates: [
        getRelativeDateStr(-2),
        getRelativeDateStr(-1),
        today
      ],
      color: '#10b981',
      createdAt: getRelativeDateStr(-15)
    }
  ];

  const events: CalendarEvent[] = [
    {
      id: 'event-1',
      userId,
      title: 'Product Strategy & Architecture Review',
      description: 'Sprint planning and milestone verification with engineering team.',
      startDate: `${today}T10:00`,
      endDate: `${today}T11:00`,
      type: 'meeting',
      category: 'Work',
      color: '#00d2ff',
      location: 'Google Meet'
    },
    {
      id: 'event-2',
      userId,
      title: 'Sync with Arun (API & Deployment)',
      description: 'Review database indexes and client authorization headers.',
      startDate: `${tomorrow}T10:00`,
      endDate: `${tomorrow}T10:30`,
      type: 'meeting',
      category: 'Work',
      color: '#38bdf8'
    },
    {
      id: 'event-3',
      userId,
      title: 'Deep Learning & Neural Nets Focus Session',
      description: 'Practice backpropagation derivations and PyTorch tensor operations.',
      startDate: `${today}T14:30`,
      endDate: `${today}T16:00`,
      type: 'study',
      category: 'Study',
      color: '#8b5cf6'
    },
    {
      id: 'event-4',
      userId,
      title: 'Team Demo & Weekly Showcase',
      startDate: `${in3Days}T15:00`,
      endDate: `${in3Days}T16:00`,
      type: 'event',
      category: 'Work',
      color: '#a855f7'
    }
  ];

  const reminders: Reminder[] = [
    {
      id: 'rem-1',
      userId,
      title: 'Call Arun tomorrow at 10 AM',
      dueDate: tomorrow,
      time: '10:00 AM',
      priority: 'high',
      completed: false,
      category: 'Work',
      createdAt: today
    },
    {
      id: 'rem-2',
      userId,
      title: 'Submit Python ML assignment milestone',
      dueDate: in3Days,
      time: '09:00 AM',
      priority: 'critical',
      completed: false,
      category: 'Study',
      createdAt: today
    }
  ];

  const notes: Note[] = [
    {
      id: 'note-1',
      userId,
      title: 'NEXA Agent Architecture & Core Philosophy',
      content: `# NEXA Agent Design Notes

NEXA is designed as an intelligent personal operating system rather than a generic chat assistant.
Key architectural tenets:

1. **Context Grounding**: Connects tasks, active goals, habits, and user calendar seamlessly.
2. **Proactive Intervention**: Suggests high-leverage focus blocks when open time windows appear.
3. **Safety & Confirmation**: Always requests clear confirmation cards before modifying user records.
4. **Adaptive Learning**: Continuous roadmap adaptation based on quiz diagnostics and study pacing.

Action Items:
- Finish project report
- Call client regarding API keys
- Buy domain for production rollout
- Verify database backup triggers`,
      tags: ['Architecture', 'Product', 'AI Agent'],
      category: 'Work',
      pinned: true,
      extractedTasks: [
        'Finish project report',
        'Call client regarding API keys',
        'Buy domain for production rollout',
        'Verify database backup triggers'
      ],
      updatedAt: today
    },
    {
      id: 'note-2',
      userId,
      title: 'Python Neural Networks & Backprop Cheatsheet',
      content: `### Backpropagation Key Rules
- Loss gradients flow backward via the chain rule.
- Weight updates: W = W - learning_rate * dL/dW.
- Momentum helps navigate ravines and suppresses oscillating gradient steps.
- Layer Normalization is preferred over Batch Norm for recurrent/sequence architectures.

Questions to revisit:
- How does Adam optimizer maintain both first and second raw moment vectors?
- What are the trade-offs of GeLU vs ReLU in transformer feed-forward blocks?`,
      tags: ['Python', 'Deep Learning', 'Math'],
      category: 'Study',
      pinned: false,
      updatedAt: getRelativeDateStr(-2)
    }
  ];

  const studyPlans: StudyPlan[] = [
    {
      id: 'study-plan-ml',
      userId,
      subject: 'Machine Learning & Neural Networks',
      examDate: in10Days,
      targetScore: '95%',
      knowledgeLevel: 'Intermediate',
      dailyHours: 2,
      weakTopics: ['Backprop in Matrix Calculus', 'Attention Mechanism Derivations'],
      studyTips: [
        'Solve 5 code exercises before reviewing theory',
        'Use active recall flashcards right before bed',
        'Schedule 15-minute review sessions every morning'
      ],
      roadmap: [
        {
          day: 1,
          date: 'Day 1',
          topic: 'Loss Surfaces, Convex Optimization & Gradient Descent',
          subtopics: ['Cost functions (MSE, Cross-Entropy)', 'Learning rates & schedules', 'Stochastic vs Batch'],
          hours: 2,
          completed: true,
          practiceQuestions: [
            {
              question: 'Why is Stochastic Gradient Descent (SGD) computationally faster per step than Batch Gradient Descent?',
              options: [
                'It evaluates loss over the entire dataset at once',
                'It estimates the gradient using a single sample or mini-batch',
                'It eliminates the need for learning rates',
                'It guarantees monotonic convergence in non-convex spaces'
              ],
              answerIndex: 1,
              explanation: 'SGD processes one sample or mini-batch per iteration, drastically reducing computation time per step.'
            }
          ]
        },
        {
          day: 2,
          date: 'Day 2',
          topic: 'Multi-Layer Perceptrons & Backpropagation in Code',
          subtopics: ['Matrix representations of forward pass', 'Jacobians and gradient caching', 'Vanishing gradient prevention'],
          hours: 2,
          completed: false,
          practiceQuestions: [
            {
              question: 'Which activation function is most effective at preventing the vanishing gradient problem in deep networks?',
              options: ['Sigmoid', 'Tanh', 'ReLU / GeLU', 'Linear pass-through'],
              answerIndex: 2,
              explanation: 'ReLU and GeLU have non-saturating positive regimes where derivative is constant 1 or well-behaved, avoiding exponential decay of gradients.'
            }
          ]
        },
        {
          day: 3,
          date: 'Day 3',
          topic: 'Regularization, Dropout & Batch Normalization',
          subtopics: ['L1 Lasso vs L2 Ridge', 'Inverted Dropout behavior during inference', 'Internal covariate shift'],
          hours: 2,
          completed: false,
          practiceQuestions: [
            {
              question: 'During inference (testing), how does standard inverted dropout behave?',
              options: [
                'It drops 50% of the neurons randomly',
                'It scales activations down by p',
                'It disables neuron dropping completely and passes signals through directly',
                'It doubles all weights'
              ],
              answerIndex: 2,
              explanation: 'With inverted dropout, activations are scaled up by 1/(1-p) during training, meaning during test time the network runs normally with all neurons active.'
            }
          ]
        }
      ],
      createdAt: getRelativeDateStr(-3)
    }
  ];

  const dailyPlan: DailyPlan = {
    id: `plan-${today}`,
    userId,
    date: today,
    aiNotes: 'Optimized for high-impact creative focus before noon, with built-in buffers for lunch and technical study.',
    timeBlocks: [
      { id: 'tb-1', time: '07:30 - 08:15', title: 'Morning 6km run & Hydration', durationMinutes: 45, category: 'Health', source: 'habit', completed: true },
      { id: 'tb-2', time: '08:30 - 09:00', title: 'Breakfast & NEXA Daily Focus Briefing', durationMinutes: 30, category: 'Health', source: 'habit', completed: true },
      { id: 'tb-3', time: '09:00 - 10:00', title: 'Deep Work: Priority Engine & UX audit', durationMinutes: 60, category: 'Work', source: 'task', completed: true, referenceId: 'task-1' },
      { id: 'tb-4', time: '10:00 - 11:00', title: 'Product Strategy & Architecture Review', durationMinutes: 60, category: 'Work', source: 'event', completed: false, referenceId: 'event-1' },
      { id: 'tb-5', time: '11:15 - 12:30', title: 'Implementation: Complete Milestone Tasks', durationMinutes: 75, category: 'Work', source: 'task', completed: false },
      { id: 'tb-6', time: '12:30 - 13:30', title: 'Mindful Lunch & Digital Detox Break', durationMinutes: 60, category: 'Break', source: 'break', completed: false },
      { id: 'tb-7', time: '14:30 - 16:00', title: 'Neural Networks & Deep Learning Session', durationMinutes: 90, category: 'Study', source: 'study', completed: false, referenceId: 'event-3' },
      { id: 'tb-8', time: '16:15 - 17:00', title: 'Admin wrap-up & Tomorrow Preparation', durationMinutes: 45, category: 'Personal', source: 'habit', completed: false }
    ],
    generatedAt: today
  };

  const memories: UserMemory[] = [
    {
      id: 'mem-1',
      userId,
      category: 'work_habit',
      key: 'Peak Focus Hours',
      value: 'Performs best on high-cognitive engineering tasks between 09:00 AM and 11:30 AM.',
      enabled: true,
      createdAt: getRelativeDateStr(-10)
    },
    {
      id: 'mem-2',
      userId,
      category: 'routine',
      key: 'Study Block Length',
      value: 'Prefers 45 to 60 minute focused study blocks followed by 10 minute physical movement breaks.',
      enabled: true,
      createdAt: getRelativeDateStr(-8)
    },
    {
      id: 'mem-3',
      userId,
      category: 'preference',
      key: 'Planning Style',
      value: 'Favors structured time-blocked days with high-priority items scheduled before midday.',
      enabled: true,
      createdAt: getRelativeDateStr(-5)
    },
    {
      id: 'mem-4',
      userId,
      category: 'goal_context',
      key: 'Primary 2026 Objective',
      value: 'Launching NEXA AI SaaS to early power users and mastering production AI systems.',
      enabled: true,
      createdAt: getRelativeDateStr(-14)
    }
  ];

  const recommendations: AIRecommendation[] = [
    {
      id: 'rec-1',
      userId,
      title: 'High-Priority Project Deadline Tomorrow',
      description: 'You have 2 high-priority tasks due tomorrow (Call Arun & Prepare ML deck). Would you like me to reserve a morning slot?',
      actionType: 'daily_plan',
      priority: 'high',
      actionLabel: 'Schedule Morning Block',
      payload: { duration: 90, time: '09:00 AM' },
      status: 'pending',
      createdAt: today
    },
    {
      id: 'rec-2',
      userId,
      title: 'Python ML Goal Momentum',
      description: 'Your next milestone "Build Multi-Agent Orchestrator" is due in 3 days. Dedicating 45 minutes today keeps you on target.',
      actionType: 'create_study',
      priority: 'medium',
      actionLabel: 'Review Roadmap',
      payload: { subject: 'Machine Learning & Neural Networks' },
      status: 'pending',
      createdAt: today
    },
    {
      id: 'rec-3',
      userId,
      title: 'Habit Streak Protection',
      description: 'Your "Daily Technical Reading" streak is at 8 days. 20 minutes tonight will lock in your 9-day personal record!',
      actionType: 'habit_nudge',
      priority: 'medium',
      actionLabel: 'Log Reading',
      payload: { habitId: 'habit-study' },
      status: 'pending',
      createdAt: today
    }
  ];

  const notifications: Notification[] = [
    {
      id: 'notif-1',
      userId,
      title: 'Priority Task Due Today',
      message: 'NEXA Priority Engine & UX audit is scheduled for completion today at 17:00.',
      type: 'task',
      read: false,
      timestamp: '20 minutes ago',
      linkTab: 'tasks'
    },
    {
      id: 'notif-2',
      userId,
      title: 'Habit Streak Milestone',
      message: 'Congratulations! You reached a 12-day streak on Deep Coding & Architecture.',
      type: 'habit',
      read: false,
      timestamp: '2 hours ago',
      linkTab: 'habits'
    },
    {
      id: 'notif-3',
      userId,
      title: 'Upcoming Meeting in 30 Mins',
      message: 'Product Strategy & Architecture Review starts at 10:00 AM on Google Meet.',
      type: 'event',
      read: true,
      timestamp: '3 hours ago',
      linkTab: 'calendar'
    }
  ];

  const chatMessages: ChatMessage[] = [
    {
      id: 'msg-1',
      role: 'assistant',
      content: `Good morning! I am **NEXA**, your personal AI agent.

I have analyzed your schedule for today:
- You have **1 critical task** due today: *Finalize NEXA Smart Priority Engine & UX audit*.
- You have a strategy meeting at **10:00 AM**.
- Your daily habits are on a strong streak (Deep Coding is at **12 days**).

Tell me what you need—you can command me to schedule sessions, break down tasks, or generate your study roadmap.`,
      timestamp: '08:00 AM'
    }
  ];

  return {
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
    chatMessages
  };
}

// User Accounts Management
export function getRegisteredUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveRegisteredUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getActiveUserId(): string | null {
  return localStorage.getItem(CURRENT_USER_KEY);
}

export function setActiveUserId(userId: string | null): void {
  if (userId) {
    localStorage.setItem(CURRENT_USER_KEY, userId);
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

// User-Isolated Data Storage
export function loadUserData(userId: string): UserDataStore {
  try {
    const raw = localStorage.getItem(`${DATA_PREFIX}${userId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load user data:', e);
  }

  // Seed with initial realistic demo data
  const initial = createDemoData(userId);
  saveUserData(userId, initial);
  return initial;
}

export function saveUserData(userId: string, data: UserDataStore): void {
  try {
    localStorage.setItem(`${DATA_PREFIX}${userId}`, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to persist user data:', e);
  }
}

// Default Demo User Definition
export const DEMO_USER: User = {
  id: 'demo-user-1',
  name: 'Alex Chen',
  email: 'alex.chen@nexa.ai',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  createdAt: '2026-01-15T08:00:00Z',
  onboardingCompleted: true,
  preferences: {
    theme: 'dark',
    workingHoursStart: '09:00',
    workingHoursEnd: '17:00',
    dailyAvailableHours: 8,
    mainGoal: 'Launch NEXA AI SaaS MVP',
    planningStyle: 'structured',
    focusAreas: ['Engineering', 'Machine Learning', 'Peak Fitness'],
    enableAiMemory: true
  }
};
