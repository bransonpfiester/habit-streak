'use client'

import { useState } from 'react'

interface Habit {
  id: string
  name: string
  color: string
}

interface HabitManagerProps {
  habits: Habit[]
  onUpdateHabits: (habits: Habit[]) => void
}

const COLORS = [
  '#10b981', // green
  '#3b82f6', // blue
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
]

export default function HabitManager({ habits, onUpdateHabits }: HabitManagerProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newHabitName, setNewHabitName] = useState('')

  const addHabit = () => {
    if (!newHabitName.trim()) return
    
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName.trim(),
      color: COLORS[habits.length % COLORS.length]
    }
    
    onUpdateHabits([...habits, newHabit])
    setNewHabitName('')
    setIsAdding(false)
  }

  const removeHabit = (id: string) => {
    onUpdateHabits(habits.filter(h => h.id !== id))
  }

  return (
    <div className="mb-8">
      {/* Habit Pills */}
      <div className="flex flex-wrap gap-3 justify-center mb-4">
        {habits.map(habit => (
          <div
            key={habit.id}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 shadow-sm"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: habit.color }}
            />
            <span className="text-sm font-medium text-gray-700">{habit.name}</span>
            <button
              onClick={() => removeHabit(habit.id)}
              className="text-gray-400 hover:text-red-500 ml-1"
            >
              ×
            </button>
          </div>
        ))}
        
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 rounded-full bg-gray-800 text-white text-sm hover:bg-gray-700 transition-colors"
          >
            + Add Habit
          </button>
        )}
      </div>

      {/* Add Habit Form */}
      {isAdding && (
        <div className="flex gap-2 justify-center">
          <input
            type="text"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addHabit()}
            placeholder="Habit name (e.g., Gym, Cook, Read)"
            className="px-4 py-2 rounded-full bg-white/90 border border-gray-300 focus:outline-none focus:border-gray-800 text-sm"
            autoFocus
          />
          <button
            onClick={addHabit}
            className="px-4 py-2 rounded-full bg-gray-800 text-white text-sm hover:bg-gray-700"
          >
            Save
          </button>
          <button
            onClick={() => {
              setIsAdding(false)
              setNewHabitName('')
            }}
            className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 text-sm hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}
