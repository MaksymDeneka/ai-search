'use client';

import { ArrowRight } from 'lucide-react';

interface InitQuerysProps {
  questions: string[];
  handleFollowUpClick: (question: string) => void;
}

export default function InitQuerys({ questions, handleFollowUpClick }: InitQuerysProps) {
  return (
    <div className="space-y-2">
      {questions.map((question, index) => (
        <button
          key={index}
          className="w-full flex items-center justify-between p-3 bg-white hover:bg-yellow-50 border border-gray-200 rounded-lg text-left text-gray-700 transition-colors animate-in fade-in duration-300 shadow-sm"
          style={{ animationDelay: `${index * 100}ms` }}
          onClick={() => handleFollowUpClick(question)}>
          <span>{question}</span>
          <ArrowRight size={16} className="text-gray-400" />
        </button>
      ))}
    </div>
  );
}
