import React, { useState } from 'react';

const badgeColor = (value: string | null) => {
  switch (value) {
    case '긍정': return 'bg-green-100 text-green-800';
    case '부정': return 'bg-red-100 text-red-800';
    case '중립': return 'bg-gray-100 text-gray-800';
    case '높음': return 'bg-orange-100 text-orange-800';
    case '낮음': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const NewsViewer = ({ news }: { news: any[] }) => {
  const [index, setIndex] = useState(0);
  if (!news || news.length === 0) return null;

  const current = news[index];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <div className="space-y-1">
        <h2 className="text-5xl font-bold text-gray-900">{current.title}</h2>
        <a
          href={current.real_url}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          뉴스 원문 사이트 이동
        </a>
      </div>

      <div className="flex gap-2 text-sm">
        <span className={`px-2 py-1 rounded ${badgeColor(current.balence)}`}>
          Balance: {current.balence || 'N/A'}
        </span>
        <span className={`px-2 py-1 rounded ${badgeColor(current.arousal)}`}>
          Arousal: {current.arousal || 'N/A'}
        </span>
        <span className={`px-2 py-1 rounded ${badgeColor(current.importance)}`}>
          Importance: {current.importance || 'N/A'}
        </span>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-700">본문</h3>
        <div
          className="max-h-600 overflow-y-auto text-gray-800 whitespace-pre-wrap p-3 border rounded bg-gray-50"
          style={{ fontSize: '18px' }}
        >
          {current.article || '본문이 없습니다.'}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-700">요약</h3>
        <div
          className="bg-yellow-50 border border-yellow-200 rounded p-3 text-gray-800 whitespace-pre-wrap"
          style={{ fontSize: '18px' }}
        >
          {current.summary || '요약이 없습니다.'}
        </div>
      </div>


      {news.length > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setIndex((prev) => Math.max(prev - 1, 0))}
            disabled={index === 0}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            ⬅ 이전
          </button>
          <span className="text-sm text-gray-500">
            {index + 1} / {news.length}
          </span>
          <button
            onClick={() => setIndex((prev) => Math.min(prev + 1, news.length - 1))}
            disabled={index === news.length - 1}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            다음 ➡
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsViewer;
