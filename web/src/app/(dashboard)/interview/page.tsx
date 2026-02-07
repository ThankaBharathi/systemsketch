// app/(dashboard)/interview/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';

const questions = [
  { id: 'twitter', name: 'Twitter', difficulty: 'Medium', time: 45 },
  { id: 'url', name: 'URL Shortener', difficulty: 'Easy', time: 30 },
  { id: 'netflix', name: 'Netflix', difficulty: 'Hard', time: 60 },
  { id: 'whatsapp', name: 'WhatsApp', difficulty: 'Hard', time: 60 },
  { id: 'uber', name: 'Uber', difficulty: 'Hard', time: 60 },
  { id: 'payment', name: 'Payment System', difficulty: 'Medium', time: 45 },
];

export default function InterviewPage() {
  const [selectedQuestion, setSelectedQuestion] = useState<typeof questions[0] | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startInterview = (q: typeof questions[0]) => {
    setSelectedQuestion(q);
    setTimeLeft(q.time * 60);
    setIsRunning(true);
  };

  const resetInterview = () => {
    setSelectedQuestion(null);
    setIsRunning(false);
    setTimeLeft(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">🎯 Interview Practice</h1>
        <p className="text-gray-600 mb-8">Design on paper like a real interview. Reveal the model answer after time ends.</p>

        {!selectedQuestion ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {questions.map((q) => (
              <div
                key={q.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition cursor-pointer"
                onClick={() => startInterview(q)}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    q.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                    q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {q.difficulty}
                  </span>
                  <span className="text-gray-500 text-sm">{q.time} min</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Design {q.name}</h3>
                <button className="w-full py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium hover:bg-indigo-200 transition">
                  Start →
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* Timer Bar */}
            <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold">Design {selectedQuestion.name}</span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  selectedQuestion.difficulty === 'Easy' ? 'bg-green-500' :
                  selectedQuestion.difficulty === 'Medium' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}>
                  {selectedQuestion.difficulty}
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className={`text-3xl font-mono font-bold ${timeLeft < 300 ? 'text-red-400 animate-pulse' : ''}`}>
                  {formatTime(timeLeft)}
                </div>
                {timeLeft === 0 && (
                <div className="text-green-300 text-sm font-medium">
                  Time's up! You can now view the answer.
                </div>
              )}
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20"
                  >
                    {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={resetInterview}
                    className="p-2 bg-red-500 rounded-lg hover:bg-red-600"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Editor Link */}
           <div className="p-8 text-center space-y-4">
          <p className="text-gray-600">
            Design on paper like a real interview.  
            The model answer unlocks when the timer ends.
          </p>

          {/* View Answer Button */}
          <Link
            href={`/design?template=${selectedQuestion.id}`}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition ${
              timeLeft === 0
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed pointer-events-none'
            }`}
          >
            {timeLeft === 0 ? 'View Answer →' : 'Answer Locked ⏳'}
          </Link>

          {/* Try Another Question */}
          <div>
            <button
              onClick={resetInterview}
              className="text-indigo-600 font-medium hover:underline"
            >
              Try Another Question
            </button>
          </div>
        </div>
        </div> 
                )}
      </div>
    </div>
  );
}