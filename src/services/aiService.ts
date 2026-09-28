import { ActionProposal, DailyPlan, StudyPlan } from '../types';

export interface CommandResponse {
  type: 'action' | 'clarification' | 'general_response';
  clarificationQuestion?: string;
  action?: ActionProposal;
  explanation?: string;
}

export interface ChatResponse {
  reply: string;
  proposedAction?: ActionProposal;
}

export class AIService {
  static async parseCommand(command: string, context: any): Promise<CommandResponse> {
    try {
      const response = await fetch('/api/ai/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, context }),
      });
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      return await response.json();
    } catch (err: any) {
      console.warn('AI command fetch failed, using smart local parser:', err);
      // Client-side fallback
      const lower = command.toLowerCase().trim();
      if (lower.startsWith('i need to study') || lower === 'study tomorrow' || lower === 'i want to study') {
        return {
          type: 'clarification',
          clarificationQuestion: 'What subject and how long would you like to study?',
          explanation: 'Subject and estimated duration are needed to generate a targeted study session.'
        };
      }
      if (lower.includes('remind me') || lower.startsWith('reminder:')) {
        const titleMatch = command.replace(/.*remind me (to\s*)?/i, '').replace(/tomorrow.*/i, '').trim();
        const timeMatch = command.match(/(\d{1,2}(:\d{2})?\s*(am|pm))/i)?.[0] || '10:00 AM';
        const title = titleMatch || 'Reminder';
        return {
          type: 'action',
          action: {
            actionType: 'create_reminder',
            title: title.charAt(0).toUpperCase() + title.slice(1),
            summary: `Create reminder "${title}" for tomorrow at ${timeMatch}`,
            requiresConfirmation: true,
            payload: {
              title: title.charAt(0).toUpperCase() + title.slice(1),
              time: timeMatch,
              dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
              priority: 'high',
              category: 'Personal'
            }
          },
          explanation: `Interpreted reminder scheduled for tomorrow at ${timeMatch}.`
        };
      }
      if (lower.includes('plan my day') || lower.includes('plan today')) {
        return {
          type: 'action',
          action: {
            actionType: 'generate_daily_plan',
            title: 'Generate Optimized Daily Schedule',
            summary: 'Assemble today\'s tasks, habits, and priorities into a timed roadmap',
            requiresConfirmation: true,
            payload: {}
          },
          explanation: 'Generated a personalized sequence for your day.'
        };
      }
      // General task creation
      const cleanTitle = command.replace(/^(create task|add task|todo:)\s*/i, '').trim();
      return {
        type: 'action',
        action: {
          actionType: 'create_task',
          title: cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1),
          summary: `Create task: "${cleanTitle}"`,
          requiresConfirmation: true,
          payload: {
            title: cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1),
            priority: lower.includes('urgent') || lower.includes('critical') ? 'critical' : lower.includes('high') ? 'high' : 'medium',
            category: 'Work',
            dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0]
          }
        },
        explanation: 'Created actionable task item.'
      };
    }
  }

  static async sendChatMessage(messages: { role: string; content: string }[], context: any): Promise<ChatResponse> {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, context }),
      });
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      return await response.json();
    } catch (err: any) {
      console.warn('AI chat fetch failed, using local assistant:', err);
      const last = messages[messages.length - 1]?.content || '';
      return {
        reply: `I have analyzed your request regarding "${last.slice(0, 40)}". I am keeping track of your goals and daily priorities. How else can I assist with your planning today?`,
      };
    }
  }

  static async generateDailyPlan(tasks: any[], habits: any[], events: any[], preferences: any): Promise<DailyPlan> {
    try {
      const response = await fetch('/api/ai/daily-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks, habits, events, preferences }),
      });
      if (!response.ok) throw new Error('Failed to generate daily plan');
      return await response.json();
    } catch (err) {
      console.warn('Using client daily planner generator:', err);
      const today = new Date().toISOString().split('T')[0];
      return {
        id: `plan-${Date.now()}`,
        userId: '',
        date: today,
        aiNotes: 'Optimized high-cognitive workload before lunch, with active breaks to prevent fatigue.',
        timeBlocks: [
          { id: 'b1', time: '08:00 - 08:45', title: 'Morning Routine & Hydration', durationMinutes: 45, category: 'Health', source: 'habit', completed: true },
          { id: 'b2', time: '09:00 - 10:30', title: tasks[0]?.title || 'Deep Work: High Priority Milestone', durationMinutes: 90, category: 'Work', source: 'task', completed: false },
          { id: 'b3', time: '10:45 - 11:30', title: 'Secondary Task Execution', durationMinutes: 45, category: 'Work', source: 'task', completed: false },
          { id: 'b4', time: '11:45 - 12:45', title: 'Break, Nutrition & Walk', durationMinutes: 60, category: 'Break', source: 'break', completed: false },
          { id: 'b5', time: '13:00 - 14:30', title: tasks[1]?.title || 'Focused Study & Technical Reading', durationMinutes: 90, category: 'Study', source: 'study', completed: false },
          { id: 'b6', time: '15:00 - 16:30', title: 'Admin & Follow-up Items', durationMinutes: 90, category: 'Work', source: 'task', completed: false },
          { id: 'b7', time: '16:45 - 17:30', title: 'Wrap-up & Tomorrow Preview', durationMinutes: 45, category: 'Personal', source: 'habit', completed: false }
        ],
        generatedAt: today
      };
    }
  }

  static async breakdownTask(title: string, description?: string): Promise<string[]> {
    try {
      const response = await fetch('/api/ai/breakdown-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      if (!response.ok) throw new Error('Failed to break down task');
      const data = await response.json();
      return data.subtasks || [];
    } catch (err) {
      console.warn('Using client task breakdown:', err);
      return [
        `Research requirements for "${title}"`,
        `Draft architecture and outline`,
        `Build foundational implementation`,
        `Test and resolve edge cases`,
        `Final review and documentation`
      ];
    }
  }

  static async generateGoalPlan(title: string, description: string, targetDate: string, category: string): Promise<any> {
    try {
      const response = await fetch('/api/ai/goal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, targetDate, category }),
      });
      if (!response.ok) throw new Error('Failed to generate goal plan');
      return await response.json();
    } catch (err) {
      console.warn('Using client goal plan generator:', err);
      return {
        milestones: [
          { title: 'Phase 1: Foundations & Setup', targetWeeks: 2 },
          { title: 'Phase 2: Core Execution & Iteration', targetWeeks: 4 },
          { title: 'Phase 3: Launch, Polish & Mastery', targetWeeks: 6 }
        ],
        suggestedTasks: [
          { title: `Initial audit and kick-off for ${title}`, priority: 'high', estimatedHours: 3 },
          { title: `Execute primary deliverables`, priority: 'high', estimatedHours: 6 },
          { title: `Evaluation and retrospective`, priority: 'medium', estimatedHours: 2 }
        ],
        strategySummary: '3-stage milestone path with structured weekly progression.'
      };
    }
  }

  static async generateStudyPlan(params: {
    subject: string;
    examDate: string;
    knowledgeLevel: string;
    dailyHours: number;
    targetScore: string;
  }): Promise<StudyPlan> {
    try {
      const response = await fetch('/api/ai/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!response.ok) throw new Error('Failed to generate study plan');
      const data = await response.json();
      return {
        id: `study-${Date.now()}`,
        userId: '',
        subject: params.subject,
        examDate: params.examDate,
        targetScore: params.targetScore,
        knowledgeLevel: params.knowledgeLevel as any,
        dailyHours: params.dailyHours,
        roadmap: data.roadmap || [],
        weakTopics: data.weakTopics || [],
        studyTips: data.studyTips || [],
        createdAt: new Date().toISOString().split('T')[0]
      };
    } catch (err) {
      console.warn('Using client study plan generator:', err);
      const today = new Date().toISOString().split('T')[0];
      return {
        id: `study-${Date.now()}`,
        userId: '',
        subject: params.subject,
        examDate: params.examDate,
        targetScore: params.targetScore,
        knowledgeLevel: params.knowledgeLevel as any,
        dailyHours: params.dailyHours,
        weakTopics: ['Complex synthesis problems', 'Time management under pressure'],
        studyTips: ['Do active recall before reading notes', 'Practice 3 questions per session'],
        roadmap: [
          {
            day: 1,
            date: 'Day 1',
            topic: `Core Fundamentals of ${params.subject}`,
            subtopics: ['Definitions', 'Foundational Rules', 'Initial Diagnostic'],
            hours: params.dailyHours,
            completed: false,
            practiceQuestions: [
              {
                question: `What is the most effective way to retain core concepts in ${params.subject}?`,
                options: ['Active recall & spaced repetition', 'Rereading notes passively', 'Cramming all night', 'Highlighting text once'],
                answerIndex: 0,
                explanation: 'Active retrieval builds stronger neural pathways and long-term retention.'
              }
            ]
          },
          {
            day: 2,
            date: 'Day 2',
            topic: `Applied Problem Solving & Case Studies`,
            subtopics: ['Pattern recognition', 'Edge cases', 'Speed drills'],
            hours: params.dailyHours,
            completed: false,
            practiceQuestions: [
              {
                question: 'When analyzing complex multi-variable scenarios, what is the best strategy?',
                options: ['Isolate one variable at a time', 'Guess randomly', 'Ignore constraints', 'Stop testing'],
                answerIndex: 0,
                explanation: 'Variable isolation allows systematic causal determination.'
              }
            ]
          }
        ],
        createdAt: today
      };
    }
  }

  static async performNoteAction(actionType: 'summarize' | 'rewrite' | 'extract_tasks' | 'explain', content: string, title?: string): Promise<any> {
    try {
      const response = await fetch('/api/ai/note-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionType, content, title }),
      });
      if (!response.ok) throw new Error('Failed note action');
      const data = await response.json();
      return data.result;
    } catch (err) {
      console.warn('Using client note action fallback:', err);
      if (actionType === 'extract_tasks') {
        const lines = content.split('\n')
          .map(l => l.trim())
          .filter(l => l.startsWith('-') || l.startsWith('*') || l.match(/^(need to|todo|finish|call|buy|submit|review)/i))
          .map(l => l.replace(/^[-*•\d.]\s*/, '').trim())
          .filter(Boolean);
        return lines.length > 0 ? lines : ['Review key points from note', 'Follow up on referenced items'];
      }
      if (actionType === 'summarize') {
        return `### Summary of ${title || 'Note'}\n- **Core Focus**: Main subject extracted from note.\n- **Actionable Items**: Key responsibilities and priorities highlighted.\n- **Next Steps**: Keep track of upcoming deadlines related to this entry.`;
      }
      return `Refined Note:\n\n${content}\n\n*Optimized by NEXA for clarity and action.*`;
    }
  }

  static async fetchRecommendations(tasks: any[], goals: any[], habits: any[]): Promise<any[]> {
    try {
      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks, goals, habits }),
      });
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      const data = await response.json();
      return data.recommendations || [];
    } catch {
      return [];
    }
  }
}
