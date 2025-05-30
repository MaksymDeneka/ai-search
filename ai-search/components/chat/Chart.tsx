'use client';

import { useEffect, useRef, memo } from 'react';

interface ChartProps {
  ticker: string;
}

function Chart({ ticker }: ChartProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = `
      {
        "autosize": true,
        "symbol": "${ticker}",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "light",
        "style": "2",
        "locale": "en",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "calendar": false,
        "support_host": "https://www.tradingview.com",
        "container_id": "${container.current?.id}"
      }
    `;

    if (container.current) {
      container.current.appendChild(script);
    }

    return () => {
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [ticker]);

  return (
    <div className="p-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 bg-yellow-50 border border-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 22H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 2V22"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19 9L14 4L9 9L4 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-lg font-medium text-gray-800">Financial Chart: {ticker}</h2>
      </div>

      <div
        className="tradingview-widget-container pl-11"
        ref={container}
        style={{ height: '400px' }}>
        <div className="tradingview-widget-copyright">
          <a
            href="https://www.tradingview.com/"
            rel="noreferrer noopener nofollow"
            target="_blank"
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
            Track all markets on TradingView
          </a>
        </div>
      </div>
    </div>
  );
}

export default memo(Chart);
