import { Router, Request, Response } from 'express';
import { getGeminiClient } from './gemini.js';

export const apiRouter = Router();

apiRouter.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// 1. Natural Language Command Parser
apiRouter.post('/command', async (req: Request, res: Response) => {
  try {
    const { command, context } = req.body;
    if (!command || typeof command !== 'string') {
      return res.status(400).json({ error: 'Command text is required.' });
    }

    const ai = getGeminiClient();
    const nowStr = new Date().toISOString();

    if (ai) {
      const prompt = `You are NEXA's core command intelligence engine.
A user gave this command: "${command}"

Current user context:
- Current timestamp: ${nowStr}
- User goals: ${JSON.stringify(context?.goals?.map((g: any) => g.title) || [])}
- Active tasks: ${JSON.stringify(context?.tasks?.map((t: any) => ({ title: t.title, priority: t.priority, due: t.dueDate })) || [])}
- Habits: ${JSON.stringify(context?.habits?.map((h: any) => h.title) || [])}
- User memories/preferences: ${JSON.stringify(context?.memories?.map((m: any) => `${m.key}: ${m.value}`) || [])}

Rules:
1. Determine if the user command has enough information to execute an action, or if required details are missing.
   - Example of missing info: "I need to study tomorrow" -> Clarification: "What subject and how long would you like to study?"
   - Example of complete info: "Tomorrow at 9 AM remind me to submit my assignment" -> Action: create_reminder
2. Allowed action types:
   - "create_task"
   - "create_reminder"
   - "create_event"
   - "create_goal"
   - "create_habit"
   - "create_note"
   - "generate_daily_plan"
   - "break_task"
   - "create_study_plan"
   - "suggest_priorities"
3. Output MUST be valid JSON adhering to this structure:
{
  "type": "action" | "clarification" | "general_response",
  "clarificationQuestion": "question text if type is clarification",
  "action": {
    "actionType": "create_task" | "create_reminder" | "create_event" | "create_goal" | "create_habit" | "create_note" | "generate_daily_plan" | "create_study_plan",
    "title": "Title of the item",
    "summary": "Human-friendly summary for the confirmation card",
    "requiresConfirmation": true,
    "payload": {
      "title": "string",
      "dueDate": "YYYY-MM-DD string if applicable",
      "time": "HH:MM or AM/PM string if applicable",
      "priority": "critical" | "high" | "medium" | "low",
      "category": "Work" | "Personal" | "Study" | "Health" | "Finance" | "General",
      "description": "optional description",
      "subtasks": ["subtask 1", "subtask 2"],
      "targetDate": "YYYY-MM-DD if goal",
      "subject": "string if study plan"
    }
  },
  "explanation": "Brief explanation of how NEXA interpreted this request"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const responseText = response.text?.trim() || '{}';
      try {
        const parsed = JSON.parse(responseText);
        return res.json(parsed);
      } catch (err) {
        console.error('Failed to parse Gemini command response as JSON:', responseText);
      }
    }

    // Heuristic intelligent fallback if Gemini key is missing or model response parsing failed
    const lower = command.toLowerCase().trim();
    
    // Check for ambiguous study command
    if (lower.startsWith('i need to study') || lower === 'study tomorrow' || lower === 'i want to study') {
      return res.json({
        type: 'clarification',
        clarificationQuestion: 'What subject and how long would you like to study?',
        explanation: 'I need to know the subject matter and duration to schedule your study block accurately.',
      });
    }

    // Reminder parsing
    if (lower.includes('remind me') || lower.startsWith('reminder:')) {
      const titleMatch = lower.replace(/^(tomorrow at \d+(:\d+)?\s*(am|pm)?\s*)?remind me (to\s*)?/i, '')
        .replace(/tomorrow( at \d+(:\d+)?\s*(am|pm)?)?/i, '')
        .trim();
      const timeMatch = command.match(/(\d{1,2}(:\d{2})?\s*(am|pm))/i)?.[0] || '09:00 AM';
      const cleanTitle = titleMatch ? titleMatch.charAt(0).toUpperCase() + titleMatch.slice(1) : 'Reminder';

      return res.json({
        type: 'action',
        action: {
          actionType: 'create_reminder',
          title: cleanTitle,
          summary: `Create reminder "${cleanTitle}" for tomorrow at ${timeMatch}`,
          requiresConfirmation: true,
          payload: {
            title: cleanTitle,
            dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            time: timeMatch,
            priority: 'high',
            category: 'Personal'
          }
        },
        explanation: `Parsed reminder action scheduled for tomorrow at ${timeMatch}.`
      });
    }

    // Daily plan
    if (lower.includes('plan my day') || lower.includes('plan today') || lower.includes('generate daily plan') || lower.includes('show me what i should focus on today')) {
      return res.json({
        type: 'action',
        action: {
          actionType: 'generate_daily_plan',
          title: 'Generate Optimized Daily Schedule',
          summary: "Assemble today's tasks, habits, and priorities into a timed roadmap",
          requiresConfirmation: true,
          payload: {}
        },
        explanation: 'Analyzing deadlines, habits, and focus hours to structure your day.'
      });
    }

    // Study plan
    if (lower.includes('exam') || lower.includes('study plan')) {
      const subject = lower.replace(/.*(exam in|study plan for|for)\s+/i, '').replace(/\..*/, '').trim() || 'General Studies';
      return res.json({
        type: 'action',
        action: {
          actionType: 'create_study_plan',
          title: `Study Roadmap: ${subject.toUpperCase()}`,
          summary: `Generate an adaptive preparation roadmap for ${subject}`,
          requiresConfirmation: true,
          payload: {
            subject: subject.charAt(0).toUpperCase() + subject.slice(1),
            targetScore: '90%+',
            dailyHours: 2.5
          }
        },
        explanation: `Identified exam preparation intent for ${subject}.`
      });
    }

    // Default task creation
    const taskTitle = command.replace(/^(create task|add task|schedule|todo:)\s*/i, '').trim();
    return res.json({
      type: 'action',
      action: {
        actionType: 'create_task',
        title: taskTitle.charAt(0).toUpperCase() + taskTitle.slice(1),
        summary: `Create task: "${taskTitle}"`,
        requiresConfirmation: true,
        payload: {
          title: taskTitle.charAt(0).toUpperCase() + taskTitle.slice(1),
          priority: lower.includes('urgent') || lower.includes('critical') ? 'critical' : lower.includes('important') ? 'high' : 'medium',
          category: lower.includes('work') ? 'Work' : lower.includes('study') ? 'Study' : 'General',
          dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0]
        }
      },
      explanation: 'Interpreted as an actionable task item.'
    });

  } catch (error: any) {
    console.error('Command API error:', error);
    res.status(500).json({ error: error.message || 'Failed to process command' });
  }
});

// 2. Chat with NEXA Personal Agent
apiRouter.post('/chat', async (req: Request, res: Response) => {
  try {
    const { messages, context } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const ai = getGeminiClient();
    const lastUserMessage = messages[messages.length - 1]?.content || '';

    if (ai) {
      const systemInstruction = `You are NEXA, the proactive personal AI agent and intelligent operating system.
Your mission: Help the user organize tasks, reach their goals, master new subjects, maintain habits, and navigate their day.
Style:
- Concise, clear, friendly, context-aware.
- Explain WHY you recommend certain priorities.
- When the user asks to schedule, create, or break down something, offer a clear proposed action.
- Never present AI suggestions as absolute facts. Clearly describe them as AI recommendations.
- You have access to user data:
  * Goals: ${JSON.stringify(context?.goals?.map((g: any) => `${g.title} (${g.progress}% done)`)) || 'None'}
  * Pending Tasks: ${JSON.stringify(context?.tasks?.filter((t: any) => t.status !== 'completed').map((t: any) => `${t.title} [${t.priority}]`)) || 'None'}
  * Habits: ${JSON.stringify(context?.habits?.map((h: any) => `${h.title} (streak: ${h.currentStreak}d)`)) || 'None'}
  * Memories/Preferences: ${JSON.stringify(context?.memories?.map((m: any) => `${m.key}: ${m.value}`)) || 'None'}

Format your response in friendly Markdown. If the conversation directly implies an actionable step the user can take (like adding a task, scheduling a study block, or building a plan), include a JSON block at the very end formatted as:
\`\`\`action_proposal
{
  "actionType": "create_task" | "create_reminder" | "create_goal" | "generate_daily_plan" | "create_study_plan",
  "summary": "Short confirmation summary",
  "payload": { ... }
}
\`\`\`
Only include action_proposal if the user clearly indicated an action to take.`;

      const contents = messages.map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.4,
        },
      });

      const fullText = response.text || '';
      let cleanText = fullText;
      let proposedAction = undefined;

      const actionMatch = fullText.match(/```action_proposal\s*([\s\S]*?)\s*```/);
      if (actionMatch) {
        cleanText = fullText.replace(actionMatch[0], '').trim();
        try {
          proposedAction = JSON.parse(actionMatch[1]);
        } catch (e) {
          console.error('Failed to parse chat action proposal:', e);
        }
      }

      return res.json({
        reply: cleanText,
        proposedAction,
      });
    }

    // Fallback response if offline/no key
    let reply = `I'm analyzing your request. Based on your current goals and schedule, I recommend focusing on your high-priority commitments today. What would you like to tackle next?`;
    let proposedAction = undefined;

    if (lastUserMessage.toLowerCase().includes('plan my day')) {
      reply = `Here is a high-level focus strategy for today:\n\n1. **Morning Focus (09:00 - 11:30)**: High-leverage task execution.\n2. **Midday Reset (12:00 - 13:00)**: Lunch, hydration, and habit check-in.\n3. **Afternoon Deep Work (14:00 - 16:30)**: Goal progression & milestone milestones.\n4. **Evening Review (17:30 - 18:00)**: Tomorrow's prep.\n\nWould you like me to generate your full scheduled timeline into the Daily Planner?`;
      proposedAction = {
        actionType: 'generate_daily_plan',
        summary: 'Generate today\'s structured timeline',
        payload: {}
      };
    } else if (lastUserMessage.toLowerCase().includes('break') && lastUserMessage.toLowerCase().includes('task')) {
      reply = `I can help decompose your project into clear, executable steps with realistic priorities. Review the proposed action below to add them to your task manager.`;
      proposedAction = {
        actionType: 'create_task',
        summary: 'Add multi-step project breakdown',
        payload: {
          title: 'Project Roadmap Execution',
          priority: 'high',
          subtasks: ['Research requirements', 'Draft wireframes', 'Core implementation', 'Review & testing']
        }
      };
    }

    return res.json({ reply, proposedAction });
  } catch (error: any) {
    console.error('Chat API error:', error);
    res.status(500).json({ error: error.message || 'Failed to process chat' });
  }
});

// 3. Smart Daily Planner Generation
apiRouter.post('/daily-plan', async (req: Request, res: Response) => {
  try {
    const { tasks, habits, events, preferences } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      const prompt = `Generate an optimized, realistic daily schedule for a user.
Context:
- Pending Tasks: ${JSON.stringify(tasks?.map((t: any) => ({ title: t.title, priority: t.priority, estMinutes: t.estimatedMinutes || 45 })) || [])}
- Active Habits: ${JSON.stringify(habits?.map((h: any) => ({ title: h.title, timeOfDay: h.timeOfDay })) || [])}
- Scheduled Events: ${JSON.stringify(events?.map((e: any) => ({ title: e.title, start: e.startDate, end: e.endDate })) || [])}
- User Preferences: Focus hours: ${preferences?.workingHoursStart || '09:00'} to ${preferences?.workingHoursEnd || '17:00'}, Style: ${preferences?.planningStyle || 'balanced'}

Generate a structured daily schedule in JSON with time blocks starting from morning to evening:
{
  "timeBlocks": [
    {
      "id": "block-1",
      "time": "08:00 - 08:45",
      "title": "Morning Routine & Hydration",
      "durationMinutes": 45,
      "category": "Health",
      "source": "habit",
      "completed": false
    },
    ...
  ],
  "aiNotes": "Concise 1-2 sentence rationale on why this plan minimizes burnout and hits critical deadlines."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    }

    // Default intelligent schedule fallback
    const fallbackBlocks = [
      { id: 'b-1', time: '08:00 - 08:45', title: 'Morning Routine & Daily Focus Planning', durationMinutes: 45, category: 'Health', source: 'habit', completed: true },
      { id: 'b-2', time: '09:00 - 10:30', title: tasks?.[0]?.title || 'Deep Work: High Priority Milestone', durationMinutes: 90, category: 'Work', source: 'task', completed: false },
      { id: 'b-3', time: '10:45 - 11:30', title: 'Secondary Task Execution & Follow-ups', durationMinutes: 45, category: 'Work', source: 'task', completed: false },
      { id: 'b-4', time: '11:45 - 12:45', title: 'Break, Nutrition & Mindful Walk', durationMinutes: 60, category: 'Health', source: 'break', completed: false },
      { id: 'b-5', time: '13:00 - 14:30', title: tasks?.[1]?.title || 'Strategic Learning & Goal Progress', durationMinutes: 90, category: 'Study', source: 'study', completed: false },
      { id: 'b-6', time: '14:45 - 15:45', title: 'Admin Tasks, Inbox & Updates', durationMinutes: 60, category: 'Work', source: 'task', completed: false },
      { id: 'b-7', time: '16:00 - 17:00', title: 'Daily Review & Next Day Alignment', durationMinutes: 60, category: 'Personal', source: 'habit', completed: false },
    ];

    return res.json({
      timeBlocks: fallbackBlocks,
      aiNotes: 'Scheduled hard mental effort during your morning peak focus hours, with buffer breaks to sustain energy.'
    });
  } catch (error: any) {
    console.error('Daily plan error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate plan' });
  }
});

// 4. Subtask Auto-Breakdown
apiRouter.post('/breakdown-task', async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Task title is required.' });
    }

    const ai = getGeminiClient();
    if (ai) {
      const prompt = `Break down this task into 4 to 7 concrete, sequential, actionable subtasks:
Task: "${title}"
Description: "${description || ''}"

Return JSON:
{
  "subtasks": [
    "Subtask 1 title",
    "Subtask 2 title",
    "Subtask 3 title",
    "Subtask 4 title"
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    }

    return res.json({
      subtasks: [
        `Research requirements and outline for "${title}"`,
        `Set up initial structure and resources`,
        `Execute primary implementation phase`,
        `Review, test, and polish details`,
        `Finalize deliverables and archive notes`
      ]
    });
  } catch (error: any) {
    console.error('Breakdown task error:', error);
    res.status(500).json({ error: error.message || 'Failed to break down task' });
  }
});

// 5. Goal AI Planner (Milestones + Tasks)
apiRouter.post('/goal-plan', async (req: Request, res: Response) => {
  try {
    const { title, description, targetDate, category } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      const prompt = `Create a structured AI execution roadmap for this goal:
Goal: "${title}"
Category: "${category}"
Description: "${description}"
Target Date: "${targetDate}"

Return JSON:
{
  "milestones": [
    { "title": "Phase 1: Milestone Name", "targetWeeks": 2 },
    { "title": "Phase 2: Milestone Name", "targetWeeks": 4 },
    { "title": "Phase 3: Milestone Name", "targetWeeks": 6 }
  ],
  "suggestedTasks": [
    { "title": "Task 1", "priority": "high", "estimatedHours": 3 },
    { "title": "Task 2", "priority": "medium", "estimatedHours": 4 },
    { "title": "Task 3", "priority": "high", "estimatedHours": 2 }
  ],
  "strategySummary": "A concise roadmap summary"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    }

    return res.json({
      milestones: [
        { title: 'Foundation & Core Knowledge Setup', targetWeeks: 2 },
        { title: 'Intermediate Application & Practical Drills', targetWeeks: 4 },
        { title: 'Mastery, Capstone Project & Evaluation', targetWeeks: 6 }
      ],
      suggestedTasks: [
        { title: `Complete fundamentals overview for ${title}`, priority: 'high', estimatedHours: 4 },
        { title: `Set up weekly 3x practice schedule`, priority: 'medium', estimatedHours: 2 },
        { title: `Build hands-on milestone prototype`, priority: 'high', estimatedHours: 8 }
      ],
      strategySummary: `A 3-phase progression starting with fundamentals, building into real-world repetition, and finishing with benchmark evaluation.`
    });
  } catch (error: any) {
    console.error('Goal plan error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate goal plan' });
  }
});

// 6. AI Study Planner (Learning Mode)
apiRouter.post('/study-plan', async (req: Request, res: Response) => {
  try {
    const { subject, examDate, knowledgeLevel, dailyHours, targetScore } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      const prompt = `Generate a personalized comprehensive study roadmap and practice quiz for:
Subject: "${subject}"
Exam Date: "${examDate}"
Current Knowledge Level: "${knowledgeLevel}" (Beginner/Intermediate/Advanced)
Daily Available Hours: ${dailyHours}
Target Score: "${targetScore}"

Output JSON:
{
  "roadmap": [
    {
      "day": 1,
      "date": "Day 1",
      "topic": "Core Foundations & Fundamental Definitions",
      "subtopics": ["Key terminology", "Essential principles", "Setup"],
      "hours": ${dailyHours},
      "completed": false,
      "practiceQuestions": [
        {
          "question": "Sample multiple choice question testing fundamental knowledge?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "answerIndex": 1,
          "explanation": "Explanation why Option B is correct."
        }
      ]
    },
    {
      "day": 2,
      "date": "Day 2",
      "topic": "Applied Concepts & Problem Solving",
      "subtopics": ["Methodology", "Edge cases", "Practice exercises"],
      "hours": ${dailyHours},
      "completed": false,
      "practiceQuestions": [
        {
          "question": "Scenario question testing application?",
          "options": ["Choice 1", "Choice 2", "Choice 3", "Choice 4"],
          "answerIndex": 0,
          "explanation": "Detailed explanation."
        }
      ]
    }
  ],
  "weakTopics": ["Advanced edge cases", "Time-pressured problem solving"],
  "studyTips": ["Use active recall at the start of each study block", "Take 5-minute pauses every 45 minutes"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    }

    return res.json({
      roadmap: [
        {
          day: 1,
          date: 'Day 1',
          topic: `Core Foundations of ${subject}`,
          subtopics: ['Core Definitions & Framework', 'Foundational Rules', 'Initial Diagnostic'],
          hours: dailyHours || 2,
          completed: false,
          practiceQuestions: [
            {
              question: `What is the most critical starting concept in ${subject}?`,
              options: ['Consistent conceptual clarity', 'Skipping fundamentals', 'Passive reading only', 'Guesswork'],
              answerIndex: 0,
              explanation: 'Solid foundational understanding enables all subsequent advanced derivations.'
            }
          ]
        },
        {
          day: 2,
          date: 'Day 2',
          topic: 'Intermediate Synthesis & Applications',
          subtopics: ['Practice Drills', 'Problem-Solving Archetypes', 'Formula Applications'],
          hours: dailyHours || 2,
          completed: false,
          practiceQuestions: [
            {
              question: 'When encountering high-complexity problems, what is the best first step?',
              options: ['Break the problem into smaller sub-components', 'Give up immediately', 'Rely on memory alone', 'Skip to the final answer'],
              answerIndex: 0,
              explanation: 'Decomposition reduces cognitive load and allows step-by-step verification.'
            }
          ]
        }
      ],
      weakTopics: ['Complex analytical problems', 'Pacing under timed conditions'],
      studyTips: ['Do active recall questions before opening notes', 'Summarize each day in 3 key takeaways']
    });
  } catch (error: any) {
    console.error('Study plan error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate study plan' });
  }
});

// 7. AI Note Actions (Summarize, Rewrite, Extract Action Items, Explain)
apiRouter.post('/note-action', async (req: Request, res: Response) => {
  try {
    const { actionType, content, title } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Content is required.' });
    }

    const ai = getGeminiClient();
    if (ai) {
      let prompt = '';
      if (actionType === 'summarize') {
        prompt = `Summarize this note titled "${title || 'Untitled'}" concisely into 3-4 bullet points and a 1-sentence key takeaway:\n\n${content}`;
      } else if (actionType === 'rewrite') {
        prompt = `Rewrite this note to be highly professional, structured, and easy to read while retaining all factual points:\n\n${content}`;
      } else if (actionType === 'extract_tasks') {
        prompt = `Extract all concrete actionable tasks from this note. Return JSON with format: {"tasks": ["Task 1", "Task 2"]}.\n\nNote:\n${content}`;
      } else if (actionType === 'explain') {
        prompt = `Explain the difficult or key concepts in this note in simple, clear terms for a fast understanding:\n\n${content}`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: actionType === 'extract_tasks' ? 'application/json' : 'text/plain',
          temperature: 0.3,
        },
      });

      const resultText = response.text || '';
      if (actionType === 'extract_tasks') {
        try {
          const parsed = JSON.parse(resultText);
          return res.json({ result: parsed.tasks || [] });
        } catch {
          // fallback extraction
        }
      }
      return res.json({ result: resultText });
    }

    // Heuristic fallbacks
    if (actionType === 'extract_tasks') {
      const lines = content.split('\n')
        .map((l: string) => l.trim())
        .filter((l: string) => l.startsWith('-') || l.startsWith('*') || l.match(/^(need to|todo|finish|call|buy|submit|review)/i))
        .map((l: string) => l.replace(/^[-*•\d.]\s*/, '').trim())
        .filter(Boolean);

      return res.json({
        result: lines.length > 0 ? lines : ['Review key points from note', 'Follow up on referenced items']
      });
    }

    if (actionType === 'summarize') {
      return res.json({
        result: `### Summary of ${title || 'Note'}\n- **Core Focus**: Main subject extracted from input.\n- **Actionable Takeaways**: Key obligations and considerations highlighted.\n- **Executive Synthesis**: Keep track of upcoming deadlines related to this entry.`
      });
    }

    return res.json({
      result: `Refined Note:\n\n${content}\n\n*Optimized by NEXA for clarity and action.*`
    });
  } catch (error: any) {
    console.error('Note action error:', error);
    res.status(500).json({ error: error.message || 'Failed to process note action' });
  }
});

// 8. Proactive AI Recommendations Generator
apiRouter.post('/recommendations', async (req: Request, res: Response) => {
  try {
    const { tasks, goals, habits } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      const prompt = `Analyze this user's current status and generate 3 proactive, high-value AI recommendations.
Context:
- Tasks due soon / overdue: ${JSON.stringify(tasks?.filter((t: any) => t.status !== 'completed').slice(0, 5).map((t: any) => ({ title: t.title, priority: t.priority, due: t.dueDate })))}
- Active Goals: ${JSON.stringify(goals?.map((g: any) => ({ title: g.title, progress: g.progress })))}
- Habits: ${JSON.stringify(habits?.map((h: any) => ({ title: h.title, streak: h.currentStreak })))}

Return JSON:
{
  "recommendations": [
    {
      "id": "rec-1",
      "title": "Short title",
      "description": "Specific context-aware reason (e.g. You have 2 deadlines tomorrow...)",
      "actionType": "reschedule_task" | "create_study" | "habit_nudge" | "goal_checkin" | "daily_plan",
      "priority": "high" | "medium",
      "actionLabel": "Schedule Block",
      "payload": { ... }
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    }

    // Default proactive recommendations
    const recs = [
      {
        id: 'rec-1',
        title: 'Priority Deadline Approaching',
        description: 'You have high-priority tasks scheduled for this week. Would you like me to allocate a 90-minute focus block?',
        actionType: 'daily_plan',
        priority: 'high',
        actionLabel: 'Plan Focus Block',
        payload: { duration: 90 }
      },
      {
        id: 'rec-2',
        title: 'Goal Consistency Check',
        description: 'Keep momentum on your main active goal. Breaking it into quick 20-minute daily steps will boost progress.',
        actionType: 'goal_checkin',
        priority: 'medium',
        actionLabel: 'Review Milestones',
        payload: {}
      },
      {
        id: 'rec-3',
        title: 'Habit Streak Protection',
        description: 'You have an active habit streak! Complete your daily habit check-in to keep your rhythm unbroken.',
        actionType: 'habit_nudge',
        priority: 'medium',
        actionLabel: 'Log Habit',
        payload: {}
      }
    ];

    return res.json({ recommendations: recs });
  } catch (error: any) {
    console.error('Recommendations error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate recommendations' });
  }
});
