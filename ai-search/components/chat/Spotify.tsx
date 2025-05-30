"use client"

import { useState, useEffect } from "react"

export default function Spotify({ spotify }: { spotify: string }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 400)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="p-4 animate-in fade-in duration-300">
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
            <path
              d="M16.2426 7.75736C18.5858 10.1005 18.5858 13.8995 16.2426 16.2426"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7.75736 16.2426C5.41421 13.8995 5.41421 10.1005 7.75736 7.75736"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14.1213 9.87868C15.2929 11.0503 15.2929 12.9497 14.1213 14.1213"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.87868 14.1213C8.70711 12.9497 8.70711 11.0503 9.87868 9.87868"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 12C12 12 12 12 12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-lg font-medium text-gray-800">Music</h2>
      </div>

      {isLoading ? (
        <div className="pl-11 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
      ) : (
        <div className="pl-11">
          <iframe
            src={`https://open.spotify.com/embed/track/${spotify}`}
            width="100%"
            height="80"
            allow="encrypted-media"
            className="rounded-lg border-0"
          ></iframe>
        </div>
      )}
    </div>
  )
}
