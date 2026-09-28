import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudyPlan, PracticeQuestion } from '../../types';
import {
  GraduationCap,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  HelpCircle,
  Wand2,
  AlertCircle,
  Award,
  ChevronDown,
  ChevronRight,
  BookOpen
} from 'lucide-react';

export const StudyPlanner: React.FC = () => {
  const { studyPlans, createStudyPlanAI, toggleStudyDay, showToast } = useApp();

  const [activePlanId, setActivePlanId] = useState<string>(studyPlans[0]?.id || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);

  // Practice quiz modal state
  const [activeQuizQuestion, setActiveQuizQuestion] = useState<{
    question: PracticeQuestion;
    selectedOption: number | null;
    submitted: boolean;
  } | null>(null);

  // New plan state
  const [subject, setSubject] = useState('Machine Learning & Neural Networks');
  const [examDate, setExamDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [knowledgeLevel, setKnowledgeLevel] = useState('Intermediate');
  const [dailyHours, setDailyHours] = useState(2);
  const [targetScore, setTargetScore] = useState('95%');

  const activePlan = studyPlans.find((p) => p.id === activePlanId) || studyPlans[0];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    setIsGenerating(true);
    try {
      const plan = await createStudyPlanAI({
        subject: subject.trim(),
        examDate,
        knowledgeLevel,
        dailyHours: Number(dailyHours),
        targetScore
      });
      setActivePlanId(plan.id);
      setShowNewModal(false);
    } catch {
      showToast('Failed to create study roadmap', 'warning');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartQuiz = (q: PracticeQuestion) => {
    setActiveQuizQuestion({
      question: q,
      selectedOption: null,
      submitted: false
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="h-5 w-5 text-purple-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
              Cognitive Acceleration
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Study Planner & Learning Mode
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Personalized roadmaps, active recall practice quizzes, and weak-topic diagnostics.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-500/20 transition active:scale-95 shrink-0"
        >
          <Wand2 className="h-4 w-4" />
          <span>New Study Roadmap</span>
        </button>
      </div>

      {/* Plan Selector if multiple */}
      {studyPlans.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {studyPlans.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePlanId(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                activePlan?.id === p.id
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {p.subject}
            </button>
          ))}
        </div>
      )}

      {/* Active Roadmap Display */}
      {activePlan ? (
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 backdrop-blur-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                    Target Score: {activePlan.targetScore}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400 font-medium">
                    Level: {activePlan.knowledgeLevel}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {activePlan.subject}
                </h2>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
                  <Calendar className="h-4 w-4 text-purple-400" />
                  Exam: {activePlan.examDate}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
                  <Clock className="h-4 w-4 text-cyan-400" />
                  {activePlan.dailyHours} hrs/day
                </span>
              </div>
            </div>

            {/* Weak Topics Diagnostic Banner */}
            {activePlan.weakTopics && activePlan.weakTopics.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-amber-300 font-semibold">Weak-Topic Detection: </strong>
                  <span className="text-slate-300">
                    NEXA identified focus areas: {activePlan.weakTopics.join(', ')}. Reinforce these with practice questions below.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Daily Roadmap Schedule & Quiz */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Personalized Study Modules ({activePlan.roadmap.length} Days)
            </h3>

            <div className="space-y-3">
              {activePlan.roadmap.map((day) => (
                <div
                  key={day.day}
                  className={`rounded-2xl border p-4 sm:p-5 transition backdrop-blur-md ${
                    day.completed
                      ? 'bg-slate-950/60 border-slate-800 opacity-70'
                      : 'bg-slate-900/80 border-slate-800 hover:border-purple-500/30'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleStudyDay(activePlan.id, day.day)}
                        className="mt-0.5 text-slate-500 hover:text-purple-400 transition"
                      >
                        {day.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        ) : (
                          <Circle className="h-5 w-5 text-slate-500" />
                        )}
                      </button>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-purple-300 px-2 py-0.5 rounded bg-purple-500/15">
                            Day {day.day}
                          </span>
                          <span className="text-xs text-slate-400">
                            {day.hours} hours planned
                          </span>
                        </div>
                        <h4 className={`text-sm sm:text-base font-bold text-white ${day.completed ? 'line-through text-slate-400' : ''}`}>
                          {day.topic}
                        </h4>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {day.subtopics.map((st, i) => (
                            <span
                              key={i}
                              className="text-[11px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800"
                            >
                              {st}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Practice Quiz Trigger */}
                    {day.practiceQuestions && day.practiceQuestions.length > 0 && (
                      <div className="self-end sm:self-center shrink-0">
                        <button
                          onClick={() => handleStartQuiz(day.practiceQuestions![0])}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-semibold transition"
                        >
                          <Award className="h-3.5 w-3.5 text-purple-400" />
                          <span>Practice Quiz</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-12 text-center space-y-3">
          <BookOpen className="h-10 w-10 text-purple-400 mx-auto opacity-80" />
          <h3 className="text-base font-bold text-white">No Study Roadmap Active</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Create a learning roadmap to let NEXA structure your syllabus, practice questions, and daily study blocks.
          </p>
          <button
            onClick={() => setShowNewModal(true)}
            className="mt-2 px-5 py-2.5 rounded-xl bg-purple-500 text-white text-xs font-bold hover:bg-purple-400 transition"
          >
            Create Study Roadmap
          </button>
        </div>
      )}

      {/* Practice Quiz Modal */}
      {activeQuizQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-purple-500/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                <Award className="h-4 w-4" />
                Active Recall Practice
              </span>
              <button
                onClick={() => setActiveQuizQuestion(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Close
              </button>
            </div>

            <p className="text-sm font-semibold text-white">
              {activeQuizQuestion.question.question}
            </p>

            <div className="space-y-2">
              {activeQuizQuestion.question.options.map((opt, idx) => {
                const isSelected = activeQuizQuestion.selectedOption === idx;
                const isCorrect = idx === activeQuizQuestion.question.answerIndex;
                let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-purple-500/40';

                if (activeQuizQuestion.submitted) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-bold';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-500/20 border-rose-500/60 text-rose-300';
                  }
                } else if (isSelected) {
                  btnStyle = 'bg-purple-500/20 border-purple-500 text-purple-200';
                }

                return (
                  <button
                    key={idx}
                    disabled={activeQuizQuestion.submitted}
                    onClick={() =>
                      setActiveQuizQuestion(prev => (prev ? { ...prev, selectedOption: idx } : null))
                    }
                    className={`w-full text-left p-3 rounded-xl border text-xs transition ${btnStyle}`}
                  >
                    <span className="font-mono text-slate-500 mr-2">{String.fromCharCode(65 + idx)}.</span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Explanation when submitted */}
            {activeQuizQuestion.submitted && (
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="font-semibold text-cyan-300 block">AI Explanation:</span>
                <p>{activeQuizQuestion.question.explanation}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              {!activeQuizQuestion.submitted ? (
                <button
                  disabled={activeQuizQuestion.selectedOption === null}
                  onClick={() =>
                    setActiveQuizQuestion(prev => (prev ? { ...prev, submitted: true } : null))
                  }
                  className="px-5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold disabled:opacity-40 transition"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={() => setActiveQuizQuestion(null)}
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
                >
                  Finished
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Study Plan Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-white">Generate AI Study Roadmap</h2>
            <form onSubmit={handleGenerate} className="space-y-3.5">
              <div>
                <label className="text-xs font-medium text-slate-400">Subject / Exam Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Systems & Cloud Architecture"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-400">Exam / Target Date</label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400">Knowledge Level</label>
                  <select
                    value={knowledgeLevel}
                    onChange={(e) => setKnowledgeLevel(e.target.value)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Beginner">Beginner (Foundations first)</option>
                    <option value="Intermediate">Intermediate (Core drills)</option>
                    <option value="Advanced">Advanced (Complex synthesis)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-400">Daily Study Hours</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={dailyHours}
                    onChange={(e) => setDailyHours(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400">Target Score</label>
                  <input
                    type="text"
                    value={targetScore}
                    onChange={(e) => setTargetScore(e.target.value)}
                    placeholder="e.g. 90% or Grade A"
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-500/20 disabled:opacity-50"
                >
                  {isGenerating ? 'Synthesizing Roadmap...' : 'Generate Roadmap'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
