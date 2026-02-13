'use client'

import { useState } from 'react'

interface Habit {
  id: string
  name: string
  color: string
}

interface DayData {
  [habitId: string]: boolean
}

interface WeeklyViewProps {
  habits: Habit[]
  completedData: Record<string, DayData>
  onToggleHabit: (date: string, habitId: string) => void
}

export default function WeeklyView({ habits, completedData, onToggleHabit }: WeeklyViewProps) {
  const [weekOffset, setWeekOffset] = useState(0)

  const getWeekDays = (offset: number) => {
    const today = new Date()
    const currentDayOfWeek = today.getDay()
    const sunday = new Date(today)
    sunday.setDate(today.getDate() - currentDayOfWeek + (offset * 7))
    
    const days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(sunday)
      date.setDate(sunday.getDate() + i)
      days.push(date)
    }
    
    return days
  }

  const weekDays = getWeekDays(weekOffset)
  const weekStart = weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const weekEnd = weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  if (habits.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-500 italic">Add a habit to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setWeekOffset(weekOffset - 1)}
          className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
        >
          ← Previous
        </button>
        <h2 className="text-xl font-serif italic text-gray-800">
          {weekStart} - {weekEnd}
        </h2>
        <button
          onClick={() => setWeekOffset(weekOffset + 1)}
          disabled={weekOffset >= 0}
          className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-medium"
        >
          Next →
        </button>
      </div>

      {/* Weekly Grid */}
      <div className="space-y-4">
        {weekDays.map((date, dayIdx) => {
          const dateStr = date.toISOString().split('T')[0]
          const dayData = completedData[dateStr] || {}
          const isToday = dateStr === new Date().toISOString().split('T')[0]
          const isFuture = date > new Date()

          return (
            <div
              key={dateStr}
              className={`
                p-4 rounded-xl border-2 transition-all
                ${isToday ? 'border-gray-800 bg-gray-50' : 'border-gray-200 bg-white'}
                ${isFuture ? 'opacity-50' : ''}
              `}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    {date.toLocaleDateString('en-US', { weekday: 'long' })}
                  </p>
                  <p className="text-xs text-gray-400">
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {Object.values(dayData).filter(Boolean).length}/{habits.length}
                </div>
              </div>

              {/* Habit Checkboxes */}
              <div className="space-y-2">
                {habits.map(habit => {
                  const isCompleted = dayData[habit.id]
                  return (
                    <button
                      key={habit.id}
                      onClick={() => !isFuture && onToggleHabit(dateStr, habit.id)}
                      disabled={isFuture}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors disabled:cursor-not-allowed"
                    >
                      <div
                        className={`
                          w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                          ${isCompleted ? 'scale-110' : 'scale-100'}
                        `}
                        style={{
                          borderColor: habit.color,
                          backgroundColor: isCompleted ? habit.color : 'white'
                        }}
                      >
                        {isCompleted && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{habit.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
