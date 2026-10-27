import React, { useEffect, useState } from 'react';

interface NewsByDateProps {
  symbol: string;
  onSelect: (date: string) => void;
  sortDescending?: boolean;
}

const NewsByDate = ({ symbol, onSelect, sortDescending = false }: NewsByDateProps) => {
  const [dates, setDates] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) return;

    setLoading(true);
    setError(null);

    fetch(`/news/dates/${symbol}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`서버 응답 실패: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const sorted = sortDescending
          ? [...data].sort((a, b) => (a < b ? 1 : -1))
          : [...data].sort();

        setDates(sorted);

        if (sorted.length > 0) {
          onSelect(sorted[0]);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error('날짜 목록 불러오기 오류:', err);
        setError('날짜 정보를 불러오는 데 실패했습니다.');
        setLoading(false);
      });
  }, [symbol]);

  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-2 text-white">날짜 선택</h2>

      {loading && <p className="text-sm text-gray-400">날짜 불러오는 중...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && (
        <select
          className="px-4 py-2 border rounded w-full text-black font-semibold"
          onChange={(e) => onSelect(e.target.value)}
          value={dates.includes(symbol) ? symbol : dates[0] ?? ''}
        >
          {dates.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default NewsByDate;
