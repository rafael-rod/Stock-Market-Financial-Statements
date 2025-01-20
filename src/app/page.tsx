'use client'

import { useState, useEffect } from 'react'
import { Search, DollarSign, BarChart2, TrendingUp } from 'lucide-react'
import IncomeStatement from './components/IncomeStatement'
import BalanceSheet from './components/BalanceSheet'
import CashFlow from './components/CashFlow'

export default function FinancialDashboard() {
  const [ticker, setTicker] = useState('')
  const [activeStatement, setActiveStatement] = useState<'income' | 'balance' | 'cash'>('income')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    if (ticker) {
      setActiveStatement('income')
    }
  }, [ticker])

  const handleTickerSubmit = () => {
    if (searchInput.trim()) {
      setTicker(searchInput.toUpperCase())
      setIsSearchOpen(false)
      setSearchInput('')
    }
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 relative">
      {/* Header fijo */}
      <header className="absolute top-0 left-0 w-full py-4 bg-gray-900 bg-opacity-75 text-center text-sm font-medium text-gray-400 z-50 shadow-lg">
        Made with ❤️ by <span className="font-bold text-gray-200">Rafael Rodríguez</span>
      </header>

      {/* Fondo oscuro y búsqueda centrada */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-40 flex items-center justify-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTickerSubmit()}
              className="w-full text-center text-2xl font-semibold bg-transparent text-gray-100 placeholder-gray-500 outline-none border-b-2 border-gray-500 focus:border-white transition-all"
              placeholder="Enter ticker (e.g., TSLA)"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-8 pt-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
            Financial Dashboard
          </h1>
          <div className="relative z-50">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 shadow-md transition-colors duration-200"
            >
              <Search className="w-6 h-6 text-gray-300" />
            </button>
          </div>
        </div>

        {ticker && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">{ticker} Financial Statements</h2>
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveStatement('income')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    activeStatement === 'income'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <DollarSign className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setActiveStatement('balance')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    activeStatement === 'balance'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <BarChart2 className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setActiveStatement('cash')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    activeStatement === 'cash'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <TrendingUp className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="bg-black p-6 rounded-lg shadow-lg">
              {activeStatement === 'income' && <IncomeStatement ticker={ticker} />}
              {activeStatement === 'balance' && <BalanceSheet ticker={ticker} />}
              {activeStatement === 'cash' && <CashFlow ticker={ticker} />}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
