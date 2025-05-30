export default function Header() {
  return (
    <header className="sticky top-0 z-[500] flex items-center justify-between w-full px-6 border-b border-gray-200 h-14 shrink-0 bg-white backdrop-blur-xl">
      <span className="inline-flex items-center whitespace-nowrap">
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-50 border border-yellow-100 rounded-full flex items-center justify-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M12 7V12L15 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-xl font-semibold text-gray-800">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
              AI
            </span>
            search
          </span>
        </a>
      </span>
      <div className="flex items-center justify-end space-x-2">
        {/* Left side content if needed */}
      </div>
      {/* <a
        href="#"
        className="text-sm px-3 py-1.5 rounded-full bg-yellow-50 border border-yellow-100 text-gray-700 hover:bg-yellow-100 transition-colors"
      >
        Upgrade
      </a> */}
    </header>
  );
}
