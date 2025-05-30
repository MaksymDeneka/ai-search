'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

export interface SearchResult {
  favicon: string;
  link: string;
  title: string;
}

export interface SearchResultsProps {
  searchResults: SearchResult[];
}

export default function SearchResults({ searchResults }: { searchResults: SearchResult[] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loadedFavicons, setLoadedFavicons] = useState<boolean[]>([]);

  useEffect(() => {
    setLoadedFavicons(Array(searchResults.length).fill(false));
  }, [searchResults]);

  const toggleExpansion = () => setIsExpanded(!isExpanded);

  const visibleResults = isExpanded ? searchResults : searchResults.slice(0, 3);

  const handleFaviconLoad = (index: number) => {
    setLoadedFavicons((prevLoadedFavicons) => {
      const updatedLoadedFavicons = [...prevLoadedFavicons];
      updatedLoadedFavicons[index] = true;
      return updatedLoadedFavicons;
    });
  };

  const SearchResultsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {Array.from({ length: isExpanded ? searchResults.length : 3 }).map((_, index) => (
        <div key={`skeleton-${index}`} className="bg-gray-100 p-3 rounded-lg animate-pulse">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
            <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 bg-yellow-50 border border-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 21L16.65 16.65"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-lg font-medium text-gray-800">Sources</h2>
      </div>

      {searchResults.length === 0 ? (
        <SearchResultsSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-11">
            {visibleResults.map((result, index) => (
              <a
                key={`searchResult-${index}`}
                href={result.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gray-50 hover:bg-yellow-50 p-3 rounded-lg transition-colors group border border-gray-100">
                {result.favicon.length > 0 && !loadedFavicons[index] && (
                  <div className="w-5 h-5 bg-gray-300 rounded-full animate-pulse"></div>
                )}
                {result.favicon.length > 0 && (
                  <img
                    src={result.favicon || '/placeholder.svg'}
                    alt=""
                    className={`w-5 h-5 rounded-full ${loadedFavicons[index] ? 'block' : 'hidden'}`}
                    onLoad={() => handleFaviconLoad(index)}
                  />
                )}
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 truncate flex-1">
                  {result.title}
                </span>
                <ExternalLink size={14} className="text-gray-400 group-hover:text-gray-600" />
              </a>
            ))}
          </div>

          {searchResults.length > 3 && (
            <button
              onClick={toggleExpansion}
              className="flex items-center justify-center gap-1 mt-3 text-sm text-gray-500 hover:text-gray-700 transition-colors w-full">
              {isExpanded ? (
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
    </div>
  );
}
