"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, ExternalLink, Star, X } from "lucide-react"

interface ShoppingItem {
  title: string
  source: string
  link: string
  price: string
  delivery: string
  imageUrl: string
  rating: number
  ratingCount: number
  offers: string
  productId: string
  position: number
}

interface ShopProps {
  shopping: ShoppingItem[]
}

export default function Shop({ shopping }: ShopProps) {
  const [showModal, setShowModal] = useState(false)
  const [showMore, setShowMore] = useState(false)

  const visibleItems = showMore ? shopping : shopping.slice(0, 3)

  const ShoppingSkeleton = () => (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex gap-3 bg-gray-100 p-3 rounded-lg animate-pulse">
          <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 bg-yellow-50 border border-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-lg font-medium text-gray-800">Shopping</h2>

        <button
          onClick={() => setShowModal(true)}
          className="ml-auto text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ExternalLink size={16} />
        </button>
      </div>

      {shopping.length === 0 ? (
        <ShoppingSkeleton />
      ) : (
        <>
          <div className="space-y-3">
            {visibleItems.map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 bg-gray-50 hover:bg-yellow-50 border border-gray-100 p-3 rounded-lg transition-colors group"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-800 truncate group-hover:text-gray-900 transition-colors">
                    {item.title}
                  </h3>

                  <div className="flex items-center mt-1">
                    <div className="flex items-center text-yellow-400 mr-1">
                      <Star size={12} fill="currentColor" />
                    </div>
                    <span className="text-xs text-gray-600">
                      {item.rating.toFixed(1)} ({item.ratingCount})
                    </span>
                  </div>

                  <div className="text-sm font-medium text-gray-800 mt-1">{item.price}</div>
                </div>
              </a>
            ))}
          </div>

          {shopping.length > 3 && (
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
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowModal(false)}></div>

          <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="sticky top-0 bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Shopping Results</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-6">
              {shopping.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-6 hover:bg-gray-50 p-4 rounded-lg transition-colors group"
                >
                  <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-800 group-hover:text-gray-900 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-gray-600 text-sm mt-1">{item.source}</p>

                    <div className="flex items-center mt-2">
                      <div className="flex items-center text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={i < Math.floor(item.rating) ? "currentColor" : "none"}
                            className={i < Math.floor(item.rating) ? "text-yellow-400" : "text-gray-300"}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">({item.ratingCount})</span>
                    </div>

                    <div className="text-lg font-semibold text-gray-800 mt-2">{item.price}</div>

                    {item.delivery && <p className="text-gray-600 text-sm mt-1">{item.delivery}</p>}
                  </div>

                  <div className="text-gray-500 self-center">
                    <ExternalLink size={16} />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
