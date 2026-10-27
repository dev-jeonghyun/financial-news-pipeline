import React, { useEffect, useRef } from 'react';

interface TradingViewWidgetProps {
  symbol: string;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({ symbol }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!symbol || !containerRef.current) return;

    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;

    script.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          width: '100%',
          height: 900,
          symbol: symbol,
          interval: '1D',
          timezone: 'Asia/Seoul',
          theme: 'dark',
          style: '1',
          locale: 'ko',
          container_id: 'tradingview_container'
        });
      }
    };

    containerRef.current.appendChild(script);
  }, [symbol]);

  return (
    <div className="my-6">
      <div id="tradingview_container" ref={containerRef} />
    </div>
  );
};

export default TradingViewWidget;
