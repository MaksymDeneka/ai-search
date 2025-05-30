"use client"

import { Plus } from "lucide-react"

interface FollowUp {
  choices: {
    message: {
      content: string
    }
  }[]
}

interface QuestionsProps {
  followUp: FollowUp
  handleFollowUpClick: (question: string) => void
}

export default function Questions({ followUp, handleFollowUpClick }: QuestionsProps) {
  const handleQuestionClick = (question: string) => {
    handleFollowUpClick(question)
  }

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-gray-600 mb-2">Follow-up questions</h3>
      <div className="flex flex-wrap gap-2">
        {followUp.choices[0].message.content &&
          JSON.parse(followUp.choices[0].message.content).followUp.map((question: string, index: number) => (
            <button
              key={index}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 hover:bg-yellow-100 border border-yellow-100 text-gray-700 rounded-full text-sm transition-colors"
              onClick={() => handleQuestionClick(question)}
            >
              <Plus size={14} />
              <span>{question}</span>
            </button>
          ))}
      </div>
    </div>
  )
}
