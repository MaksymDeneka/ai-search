"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronUp, MapPin, Phone, Globe } from "lucide-react"

interface Place {
  cid: React.Key | null | undefined
  latitude: number
  longitude: number
  title: string
  address: string
  rating: number
  category: string
  phoneNumber?: string
  website?: string
}

export default function MapDetails({ places }: { places: Place[] }) {
  const [showMore, setShowMore] = useState(false)
  // only show the first 5 places
  const displayPlaces = places.slice(0, 5)
  const visiblePlaces = showMore ? displayPlaces : displayPlaces.slice(0, 2)

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 bg-yellow-50 border border-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-lg font-medium text-gray-800">Location Details</h2>
      </div>

      <div className="space-y-3">
        {visiblePlaces.map((place: Place) => (
          <div key={place.cid} className="bg-gray-50 border border-gray-100 rounded-lg p-3">
            <h3 className="text-base font-medium text-gray-800 mb-1">{place.title}</h3>
            <div className="flex items-start gap-2 text-sm text-gray-600 mb-1">
              <MapPin size={14} className="flex-shrink-0 mt-0.5" />
              <span>{place.address}</span>
            </div>

            <div className="flex items-center mb-1">
              <div className="flex items-center text-yellow-400 mr-1">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    className={`w-3 h-3 ${index < Math.floor(place.rating) ? "text-yellow-400" : "text-gray-300"}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 15.585l-5.293 2.776.1-5.867L.416 8.222l5.875-.855L10 2.415l3.709 4.952 5.875.855-4.391 4.272.1 5.867L10 15.585z"
                      clipRule="evenodd"
                    />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-600">{place.rating.toFixed(1)}</span>
            </div>

            <div className="text-xs text-gray-600 mb-2">Category: {place.category}</div>

            <div className="flex flex-wrap gap-2">
              {place.phoneNumber && (
                <a
                  href={`tel:${place.phoneNumber}`}
                  className="flex items-center gap-1 px-2 py-1 bg-yellow-50 hover:bg-yellow-100 border border-yellow-100 rounded text-xs text-gray-700 transition-colors"
                >
                  <Phone size={12} />
                  <span>Call</span>
                </a>
              )}

              {place.website && (
                <a
                  href={place.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2 py-1 bg-yellow-50 hover:bg-yellow-100 border border-yellow-100 rounded text-xs text-gray-700 transition-colors"
                >
                  <Globe size={12} />
                  <span>Website</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {displayPlaces.length > 2 && (
        <button
          onClick={() => setShowMore(!showMore)}
          className="flex items-center justify-center gap-1 mt-3 text-sm text-gray-500 hover:text-gray-700 transition-colors w-full"
        >
          {showMore ? (
            <>
              <ChevronUp size={16} />
              <span>Show less</span>
            </>
          ) : (
            <>
              <ChevronDown size={16} />
              <span>Show more</span>
            </>
          )}
        </button>
      )}
    </div>
  )
}
