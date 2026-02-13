'use client'

import { useState, useEffect } from 'react'
import HabitGrid from '@/components/HabitGrid'
import WeeklyView from '@/components/WeeklyView'
import HabitManager from '@/components/HabitManager'

interface Habit {
  id: string
  name: string
  color: string
}

interface DayData {
  [habitId: string]: boolean
}

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [completedData, setCompletedData] = useState<Record<string, DayData>>({})
  const [view, setView] = useState<'year' | 'week'>('year')

  // Load from localStorage on mount
  useEffect(() => {
    const savedHabits = localStorage.getItem('habits')
    const savedData = localStorage.getItem('completedData')
    
    if (savedHabits) setHabits(JSON.parse(savedHabits))
    if (savedData) setCompletedData(JSON.parse(savedData))
  }, [])

  const saveHabits = (newHabits: Habit[]) => {
    setHabits(newHabits)
    localStorage.setItem('habits', JSON.stringify(newHabits))
  }

  const toggleHabit = (date: string, habitId: string) => {
    const newData = { ...completedData }
    if (!newData[date]) newData[date] = {}
    
    newData[date][habitId] = !newData[date][habitId]
    setCompletedData(newData)
    localStorage.setItem('completedData', JSON.stringify(newData))
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Painted Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="absolute inset-0 opacity-20"
             style={{
               backgroundImage: `radial-gradient(circle at 20% 50%, rgba(251, 191, 36, 0.2) 0%, transparent 50%),
                                radial-gradient(circle at 80% 80%, rgba(249, 115, 22, 0.15) 0%, transparent 50%)`
             }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-7xl font-serif font-bold text-gray-800 mb-3 italic">
            365 days.
          </h1>
          <p className="text-lg text-gray-600 font-light">
            track your habits, build your year
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setView('year')}
            className={`px-6 py-2 rounded-full transition-all ${
              view === 'year'
                ? 'bg-gray-800 text-white'
                : 'bg-white/80 text-gray-600 hover:bg-white'
            }`}
          >
            Year View
          </button>
          <button
            onClick={() => setView('week')}
            className={`px-6 py-2 rounded-full transition-all ${
              view === 'week'
                ? 'bg-gray-800 text-white'
                : 'bg-white/80 text-gray-600 hover:bg-white'
            }`}
          >
            Weekly View
          </button>
        </div>

        {/* Habit Manager */}
        <HabitManager habits={habits} onUpdateHabits={saveHabits} />

        {/* Main Content */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 md:p-12 shadow-2xl">
          {view === 'year' ? (
            <HabitGrid 
              habits={habits}
              completedData={completedData}
              onToggleHabit={toggleHabit}
            />
          ) : (
            <WeeklyView
              habits={habits}
              completedData={completedData}
              onToggleHabit={toggleHabit}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm font-light">
          <p className="italic">your progress, your story</p>
        </div>
      </div>
    </div>
  )
}
