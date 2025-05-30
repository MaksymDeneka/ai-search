"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"

interface Video {
  link: string
}

interface VideoProps {
  videos: Video[]
}

export default function Video({ videos }: VideoProps) {
  const [loadedImages, setLoadedImages] = useState<boolean[]>([])
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    setLoadedImages(Array(videos.length).fill(false))
  }, [videos])

  const handleImageLoad = (index: number) => {
    setLoadedImages((prevLoadedImages) => {
      const updatedLoadedImages = [...prevLoadedImages]
      updatedLoadedImages[index] = true
      return updatedLoadedImages
    })
  }

  const nextVideo = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length)
    setSelectedVideo(null)
  }

  const prevVideo = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length)
    setSelectedVideo(null)
  }

  const VideosSkeleton = () => <div className="w-full h-40 bg-gray-200 rounded-lg animate-pulse"></div>

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    return match ? match[1] : ""
  }

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
            <path
              d="M10 8L16 12L10 16V8Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-lg font-medium text-gray-800">Videos</h2>

        {videos.length > 1 && (
          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={prevVideo}
              className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-yellow-50 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={nextVideo}
              className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-yellow-50 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {videos.length === 0 ? (
        <VideosSkeleton />
      ) : (
        <div className="relative overflow-hidden rounded-lg aspect-video">
          {videos.map((video, index) => {
            const videoId = getYouTubeVideoId(video.link)
            const imageUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`

            return (
              <div
                key={video.link}
                className={`absolute inset-0 transition-opacity duration-300 ${
                  index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                {selectedVideo === video.link ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                    title={`YouTube Video ${index}`}
                    allowFullScreen
                    className="w-full h-full"
                    allow="autoplay"
                  ></iframe>
                ) : (
                  <>
                    {!loadedImages[index] && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="w-8 h-8 border-2 border-gray-300 border-t-yellow-300 rounded-full animate-spin"></div>
                      </div>
                    )}
                    <img
                      src={imageUrl || "/placeholder.svg"}
                      alt={`Video thumbnail ${index}`}
                      className={`w-full h-full object-cover ${loadedImages[index] ? "block" : "hidden"}`}
                      onLoad={() => handleImageLoad(index)}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <button
                        onClick={() => setSelectedVideo(video.link)}
                        className="w-16 h-16 flex items-center justify-center rounded-full bg-white/90 text-gray-600 hover:text-gray-800 hover:bg-white transition-colors shadow-lg"
                      >
                        <Play size={24} fill="currentColor" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
