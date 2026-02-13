'use client'

import { useState, useEffect } from 'react'
import YearGrid from '@/components/YearGrid'

export default function Home() {
  const [completedDays, setCompletedDays] = useState<Set<string>>(new Set())
  const [currentStreak, setCurrentStreak] = useState(0)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('completedDays')
    if (saved) {
      setCompletedDays(new Set(JSON.parse(saved)))
    }
  }, [])

  // Calculate streak
  useEffect(() => {
    const today = new Date()
    let streak = 0
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      if (completedDays.has(dateStr)) {
        streak++
      } else if (i > 0) {
        // Allow missing today, but break on first gap
        break
      }
    }
    
    setCurrentStreak(streak)
  }, [completedDays])

  const toggleDay = (date: string) => {
    const newCompleted = new Set(completedDays)
    if (newCompleted.has(date)) {
      newCompleted.delete(date)
    } else {
      newCompleted.add(date)
    }
    setCompletedDays(newCompleted)
    localStorage.setItem('completedDays', JSON.stringify([...newCompleted]))
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Painted Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100">
        <div className="absolute inset-0 opacity-30"
             style={{
               backgroundImage: `radial-gradient(circle at 20% 50%, rgba(251, 191, 36, 0.3) 0%, transparent 50%),
                                radial-gradient(circle at 80% 80%, rgba(249, 115, 22, 0.2) 0%, transparent 50%),
                                radial-gradient(circle at 40% 20%, rgba(234, 179, 8, 0.2) 0%, transparent 50%)`
             }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-block bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-600 mb-4">
            Day {completedDays.size}
          </div>
          <h1 className="text-7xl md:text-8xl font-serif font-bold text-gray-800 mb-4">
            365 days.
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Build your habit, one day at a time.<br />
            Click any day to mark it complete.
          </p>
        </div>

        {/* Streak Counter */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white/90 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg">
            <p className="text-sm text-gray-500 mb-1">Current Streak</p>
            <p className="text-5xl font-bold text-orange-500">{currentStreak}</p>
            <p className="text-sm text-gray-500 mt-1">days</p>
          </div>
        </div>

        {/* Year Grid */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl max-w-6xl mx-auto">
          <YearGrid 
            completedDays={completedDays}
            onToggleDay={toggleDay}
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Track your progress. Build consistency. Own your year.</p>
        </div>
      </div>
    </div>
  )
}
