import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

interface TickerOption {
  ticker: string
  name: string
}

function SelectInterest() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const navigate = useNavigate()

  const [indexOptions, setIndexOptions] = useState<TickerOption[]>([])
  const [stockOptions, setStockOptions] = useState<TickerOption[]>([])

  const [selectedIndices, setSelectedIndices] = useState<string[]>([])
  const [selectedStocks, setSelectedStocks] = useState<string[]>([])

  const handleToggle = (
    value: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (list.includes(value)) {
      setList(list.filter(v => v !== value))
    } else {
      setList([...list, value])
    }
  }

  useEffect(() => {
    if (!token) {
      console.warn("토큰 없음. 인증되지 않은 접근")
      return
    }

    const fetchData = async () => {
      try {
        const [indexRes, stockRes] = await Promise.all([
          //axios.get("http://localhost:8080/stock/index-names"),
          //axios.get("http://localhost:8080/stock/batmmaan-names")
          axios.get("http://34.22.108.245:8080/stock/index-names"),
          axios.get("http://34.22.108.245:8080/stock/batmmaan-names")
        ])
        setIndexOptions(indexRes.data)
        setStockOptions(stockRes.data)
      } catch (err) {
        console.error("선택지 로딩 실패", err)
      }
    }

    fetchData()
  }, [token])

  const handleSubmit = async () => {
    if (!token) return alert("토큰이 없습니다. 다시 로그인 해주세요.")

    try {
      //await axios.post("http://localhost:8080/auth/register-complete", {
      await axios.post("http://34.22.108.245:8080/auth/register-complete", {
        token,
        selectedIndices,
        selectedStocks,
      })
      alert("회원가입이 완료되었습니다!")
      if (selectedStocks.length > 0) {
        navigate(`/chart/${selectedStocks[0]}`)
      }
    } catch (err: any) {
      console.error("회원가입 실패:", err.response?.data || err)
      alert(`회원가입 실패: ${JSON.stringify(err.response?.data?.detail || err.message)}`)
    }
  }

  const renderButton = (
    opt: TickerOption,
    isSelected: boolean,
    onClick: () => void,
    color: 'blue' | 'green'
  ) => (
    <button
      key={opt.ticker}
      onClick={onClick}
      className={`flex flex-col items-center w-full p-4 rounded-2xl shadow-lg transition transform duration-200 text-center
        ${isSelected
          ? `bg-${color}-600 text-white scale-105 border-2 border-${color}-700`
          : "bg-white text-gray-800 hover:shadow-xl hover:scale-105"}`}
    >
      <div className="w-32 h-32 mb-3 flex justify-center items-center bg-white border border-gray-300 rounded-xl overflow-hidden">
        <img
          src={`/logos/${opt.ticker}.png`}
          alt={opt.ticker}
          className="w-28 h-28 object-contain"
          onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
        />
      </div>
      <span className="font-bold text-2xl">{opt.name}</span>
      <span className="text-xl text-gray-400 font-medium">({opt.ticker})</span>
    </button>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 px-6 py-10 text-black max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-800">Finance-Flow에 오신것을 환영합니다</h1>
      <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-800">관심 종목과 시장 지수를 선택하세요</h1>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-4 flex items-center justify-between">
          시장 지수
          <span className="text-sm text-gray-500 ml-2 font-normal">
            {selectedIndices.length === 0 ? '선택 안함' : selectedIndices.join(', ')}
          </span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {indexOptions.map(opt => {
            const isSelected = selectedIndices.includes(opt.ticker)
            return renderButton(opt, isSelected, () =>
              handleToggle(opt.ticker, selectedIndices, setSelectedIndices), 'blue')
          })}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-4 flex items-center justify-between">
          관심 종목
          <span className="text-sm text-gray-500 ml-2 font-normal">
            {selectedStocks.length === 0 ? '선택 안함' : selectedStocks.join(', ')}
          </span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stockOptions.map(opt => {
            const isSelected = selectedStocks.includes(opt.ticker)
            return renderButton(opt, isSelected, () =>
              handleToggle(opt.ticker, selectedStocks, setSelectedStocks), 'blue')
          })}
        </div>
      </section>

      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="px-8 py-3 bg-purple-600 text-white text-lg font-semibold rounded-xl shadow hover:bg-purple-700 transition"
        >
          회원가입 완료
        </button>
      </div>
    </div>
  )
}

export default SelectInterest