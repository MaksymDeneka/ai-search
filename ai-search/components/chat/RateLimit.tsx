export default function RateLimit() {
  return (
    <div className="bg-white border border-red-200 rounded-lg p-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 bg-red-50 text-red-500 border border-red-200 rounded-full flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path
              d="M10.29 3.86001L1.82001 18C1.64537 18.3024 1.55296 18.6453 1.55199 18.9945C1.55101 19.3437 1.6415 19.6871 1.81443 19.9905C1.98737 20.2939 2.23672 20.5468 2.53771 20.7239C2.83869 20.901 3.1808 20.9962 3.53001 21H20.47C20.8192 20.9962 21.1613 20.901 21.4623 20.7239C21.7633 20.5468 22.0126 20.2939 22.1856 19.9905C22.3585 19.6871 22.449 19.3437 22.448 18.9945C22.447 18.6453 22.3546 18.3024 22.18 18L13.71 3.86001C13.5317 3.56611 13.2807 3.32313 12.9812 3.15449C12.6817 2.98585 12.3437 2.89726 12 2.89726C11.6563 2.89726 11.3183 2.98585 11.0188 3.15449C10.7193 3.32313 10.4683 3.56611 10.29 3.86001Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-lg font-medium text-red-600">Rate Limit Reached</h2>
      </div>

      <p className="text-gray-700 pl-11">
        You've reached the maximum number of requests allowed. Please try again later or upgrade your plan for higher
        limits.
      </p>

      <div className="mt-4 pl-11">
        <a
          href="#"
          className="inline-flex items-center justify-center px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-lg transition-colors text-sm"
        >
          Upgrade Plan
        </a>
      </div>
    </div>
  )
}
