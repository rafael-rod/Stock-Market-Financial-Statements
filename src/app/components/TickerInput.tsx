import { useState } from 'react'

interface TickerInputProps {
  onSubmit: (ticker: string) => void
}

export default function TickerInput({ onSubmit }: TickerInputProps) {
  const [inputTicker, setInputTicker] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputTicker.trim()) {
      onSubmit(inputTicker.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex justify-center">
      <input
        type="text"
        value={inputTicker}
        onChange={(e) => setInputTicker(e.target.value)}
        placeholder="Enter stock ticker (e.g., AAPL)"
        className="px-4 py-2 bg-gray-700 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors duration-200"
      >
        Submit
      </button>
    </form>
  )
}

