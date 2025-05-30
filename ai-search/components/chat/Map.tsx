"use client"

import type React from "react"

import { useRef } from "react"
import "leaflet/dist/leaflet.css"
import dynamic from "next/dynamic"
import L from "leaflet"

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })

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

function Map({ places }: { places: Place[] }) {
  const customIcon = L.icon({
    iconUrl: "https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  })

  const mapRef = useRef<L.Map | null>(null)

  const center =
    places.length > 0
      ? [
          places.reduce((acc, place) => acc + place.latitude / places.length, 0),
          places.reduce((acc, place) => acc + place.longitude / places.length, 0),
        ]
      : [0, 0]

  return (
    <div className="p-4 animate-in fade-in duration-300">
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
        <h2 className="text-lg font-medium text-gray-800">Locations</h2>
      </div>

      <div className="pl-11 h-[400px] rounded-lg overflow-hidden border border-gray-200">
        <MapContainer
          // @ts-ignore
          center={center}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          attributionControl={false}
          zoomControl={false}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {places.map((place: Place) => (
            <Marker key={place.cid} position={[place.latitude, place.longitude]} icon={customIcon}>
              <Popup>
                <div className="p-2">
                  <h3 className="text-lg font-semibold mb-1">{place.title}</h3>
                  <p className="text-gray-600 text-sm mb-1">{place.address}</p>
                  <div className="flex items-center mb-1">
                    <span className="text-gray-600 text-sm mr-1">Rating:</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <svg
                          key={index}
                          className={`w-4 h-4 ${
                            index < Math.floor(place.rating) ? "text-yellow-400" : "text-gray-300"
                          }`}
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
                  </div>
                  <p className="text-gray-600 text-sm mb-1">Category: {place.category}</p>
                  {place.phoneNumber && <p className="text-gray-600 text-sm mb-1">Phone: {place.phoneNumber}</p>}
                  {place.website && (
                    <p className="text-gray-600 text-sm">
                      Website:{" "}
                      <a href={place.website} className="text-blue-500 hover:underline">
                        {place.website}
                      </a>
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}

const DynamicMap = dynamic(() => Promise.resolve(Map), { ssr: false })

export default DynamicMap
