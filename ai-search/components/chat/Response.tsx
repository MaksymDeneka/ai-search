"use client"

import { useState } from "react"
import { useActions } from "ai/rsc"
import Markdown from "react-markdown"
import CopyToClipboard from "react-copy-to-clipboard"
import { Check, Copy, RefreshCw } from "lucide-react"
import type { AI } from "../../app/action"

interface ResponseProps {
  llmResponse: string
  currentLlmResponse: string
  index: number
  semanticCacheKey: string
  isolatedView: boolean
  logo?: string
}

const Modal = ({ message, onClose }: { message: string; onClose: () => void }) => {
  return (
    <div className="fixed top-4 right-4 z-50 bg-white border border-gray-200 shadow-lg rounded-lg p-4 w-full max-w-sm animate-in slide-in-from-top duration-300">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Notice</h2>
        <button className="text-gray-400 hover:text-gray-600 transition-colors" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <div className="mt-2 text-gray-600">{message}</div>
    </div>
  )
}

const StreamingComponent = ({ currentLlmResponse }: { currentLlmResponse: string }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 bg-yellow-50 border border-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-lg font-medium text-gray-800">Answer</h2>
      </div>
      <div className="text-gray-700 pl-11">
        <div className="animate-pulse">{currentLlmResponse}</div>
      </div>
    </div>
  )
}

const SkeletonLoader = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 bg-yellow-50 border border-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
          <div className="w-4 h-4 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
        <div className="h-5 bg-gray-200 rounded-full w-24 animate-pulse"></div>
      </div>
      <div className="pl-11 space-y-2">
        <div className="h-4 bg-gray-200 rounded-full w-full animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded-full w-5/6 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded-full w-4/6 animate-pulse"></div>
      </div>
    </div>
  )
}

export default function Response({
  llmResponse,
  currentLlmResponse,
  index,
  semanticCacheKey,
  isolatedView,
  logo,
}: ResponseProps) {
  const { clearSemanticCache } = useActions<typeof AI>()
  const [showModal, setShowModal] = useState(false)
  const [copied, setCopied] = useState(false)

  const hasLlmResponse = llmResponse && llmResponse.trim().length > 0
  const hasCurrentLlmResponse = currentLlmResponse && currentLlmResponse.trim().length > 0

  const handleClearCache = () => {
    clearSemanticCache(semanticCacheKey)
    setShowModal(true)
  }

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!hasLlmResponse && !hasCurrentLlmResponse) {
    return <SkeletonLoader />
  }

  if (!hasLlmResponse && hasCurrentLlmResponse) {
    return <StreamingComponent currentLlmResponse={currentLlmResponse} />
  }

  return (
    <div className={isolatedView ? "max-w-4xl mx-auto" : ""}>
      {showModal && (
        <Modal
          message={`The query of '${semanticCacheKey}' has been cleared from cache.`}
          onClose={() => setShowModal(false)}
        />
      )}

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 animate-in fade-in duration-300">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-yellow-50 border border-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path
                d="M12 8H12.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-gray-800">Answer</h2>
          {logo && <img src={logo || "/placeholder.svg"} alt="Provider logo" className="h-6 ml-auto" />}
        </div>

        <div className="text-gray-700 pl-11 markdown-container prose prose-gray prose-sm max-w-none">
          <Markdown>{llmResponse}</Markdown>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <CopyToClipboard text={llmResponse} onCopy={handleCopy}>
              <button
                className="text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1.5 text-sm"
                aria-label="Copy to clipboard"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </CopyToClipboard>

            {!isolatedView && (
              <button
                className="text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1.5 text-sm"
                onClick={handleClearCache}
                aria-label="Refresh response"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            )}
          </div>

          {!isolatedView && (
            <div className="flex items-center">
              <img src="./powered-by-groq.svg" alt="powered by groq" className="h-5" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
