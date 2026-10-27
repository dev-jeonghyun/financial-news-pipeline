import React, { useEffect, useState } from 'react';
import NewsByDate from '../components/NewsByDate';
import NewsViewer from '../components/NewsViewer';
import TradingViewWidget from '../components/TradingViewWidget';

interface TickerOption {
  ticker: string;
  name: string;
}

const tickers: TickerOption[] = [
  { ticker: 'MSFT', name: '마이크로소프트' },
  { ticker: 'NVDA', name: '엔비디아' },
  { ticker: 'AAPL', name: '애플' },
  { ticker: 'AMZN', name: '아마존' },
  { ticker: 'GOOGL', name: '구글' },
  { ticker: 'META', name: '메타' },
  { ticker: 'TSLA', name: '테슬라' },
  { ticker: 'AVGO', name: '브로드컴' },
  { ticker: 'NDX', name: 'NASDAQ 100' },
  { ticker: 'SPX', name: 'S&P 500' },
];

const getTradingViewSymbol = (ticker: string) => {
  if (ticker === 'SPX') return 'OANDA:SPX500USD';
  if (ticker === 'NDX') return 'INDEX:NDX';
  return `NASDAQ:${ticker}`;
};

const MainPage = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('MSFT');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [news, setNews] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'chart' | 'news'>('chart');

  useEffect(() => {
    if (selectedSymbol && selectedDate) {
      fetch(`/news/${selectedSymbol}/${selectedDate}`)
        .then(res => res.json())
        .then(data => {
          setNews(data);
          setCurrentIndex(0);
        });
    }
  }, [selectedSymbol, selectedDate]);

  const total = news.length;
  const selectedTicker = tickers.find(t => t.ticker === selectedSymbol);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <div className="flex items-center justify-between bg-gray-900 px-4 py-2 overflow-x-auto">
        <div className="flex space-x-1">
          {tickers.map((item) => (
            <img
              key={item.ticker}
              src={`/logos/${item.ticker}.png`}
              alt={item.name}
              title={`${item.name} (${item.ticker})`}
              className={`cursor-pointer border rounded transition-transform hover:scale-105 h-44 w-44 object-contain bg-transparent ${
                selectedSymbol === item.ticker ? 'ring-4 ring-blue-500' : 'border-gray-300'
              }`}
              onClick={() => {
                if (selectedSymbol !== item.ticker) {
                  setSelectedSymbol(item.ticker);
                  setSelectedDate(null);
                  setNews([]);
                  setCurrentIndex(0);
                }
                else {
                  setSelectedSymbol(item.ticker);
                  setSelectedDate(null);
                  setNews([]);
                  setCurrentIndex(0);
                }
              }}
            />
          ))}
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/';
          }}
          className="bg-red-500 text-white px-8 py-8 rounded hover:bg-red-600 font-semibold"
        >
          로그아웃
        </button>
      </div>

      {selectedSymbol && selectedTicker && (
        <div className="flex-1 p-6">
          <div className="mb-4 flex items-center space-x-4">
            <img src={`/logos/${selectedTicker.ticker}.png`} alt={selectedTicker.name} className="h-32 w-32 rounded" />
            <span className="text-6xl font-bold">{selectedTicker.name}</span>
          </div>

          <div className="mb-4 flex space-x-4">
            <button
              onClick={() => setViewMode('chart')}
              className={`px-10 py-4 rounded font-semibold ${viewMode === 'chart' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Chart
            </button>
            <button
              onClick={() => setViewMode('news')}
              className={`px-10 py-4 rounded font-semibold ${viewMode === 'news' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              News
            </button>
          </div>

          {viewMode === 'chart' && (
            <TradingViewWidget symbol={getTradingViewSymbol(selectedSymbol)} />
          )}

          {viewMode === 'news' && (
            <div className="bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700">
              <NewsByDate symbol={selectedTicker.ticker} onSelect={setSelectedDate} sortDescending={true} />

              {!selectedDate && (
                <p className="text-sm text-gray-500 mt-2">날짜를 선택하면 뉴스를 확인할 수 있습니다.</p>
              )}
              {selectedDate && news.length === 0 && (
                <p className="text-gray-500 mt-4">해당 날짜의 뉴스가 없습니다.</p>
              )}

              {news.length > 0 && (
                <>
                  <div className="flex items-center justify-between mt-2 mb-2">
                    <button
                      onClick={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
                      disabled={currentIndex === 0}
                      className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
                    >
                      ⬅ 이전
                    </button>
                    <div className="flex items-center space-x-2">
                      <span>{currentIndex + 1} / {total}</span>
                      <select
                        value={currentIndex}
                        onChange={(e) => setCurrentIndex(Number(e.target.value))}
                        className="border rounded px-2 py-1 text-black"
                      >
                        {news.map((_, i) => (
                          <option key={i} value={i}>{i + 1}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => setCurrentIndex(prev => Math.min(prev + 1, total - 1))}
                      disabled={currentIndex === total - 1}
                      className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
                    >
                      다음 ➡
                    </button>
                  </div>
                  <NewsViewer news={[news[currentIndex]]} />
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MainPage;
