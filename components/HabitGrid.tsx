'use client'

interface Habit {
  id: string
  name: string
  color: string
}

interface DayData {
  [habitId: string]: boolean
}

interface HabitGridProps {
  habits: Habit[]
  completedData: Record<string, DayData>
  onToggleHabit: (date: string, habitId: string) => void
}

export default function HabitGrid({ habits, completedData, onToggleHabit }: HabitGridProps) {
  const generateYearDays = () => {
    const days = []
    const year = new Date().getFullYear()
    const startDate = new Date(year, 0, 1)
    
    const firstDayOfWeek = startDate.getDay()
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      days.push(date)
    }
    
    return days
  }

  const days = generateYearDays()
  const today = new Date().toISOString().split('T')[0]

  if (habits.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-500 italic">Add a habit to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Day of Week Labels */}
      <div className="grid grid-cols-7 gap-2 text-xs text-gray-500 font-medium">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center">{day}</div>
        ))}
      </div>

      {/* Day Grid */}
      <div className="grid grid-cols-7 gap-2 sm:gap-3">
        {days.map((date, idx) => {
          if (!date) {
            return <div key={`empty-${idx}`} className="aspect-square" />
          }

          const dateStr = date.toISOString().split('T')[0]
          const dayData = completedData[dateStr] || {}
          const completedCount = Object.values(dayData).filter(Boolean).length
          const isToday = dateStr === today
          const isFuture = date > new Date()

          return (
            <div
              key={dateStr}
              className={`
                aspect-square rounded-lg relative min-h-[40px] sm:min-h-[50px]
                ${isFuture ? 'opacity-30' : ''}
                ${isToday ? 'ring-2 ring-gray-800' : ''}
              `}
            >
              {/* Day Number */}
              <div className="absolute top-1 left-1 text-[10px] text-gray-500 font-medium">
                {date.getDate()}
              </div>

              {/* Habit Dots */}
              <div className="absolute inset-0 flex items-center justify-center gap-1 flex-wrap p-2">
                {habits.map(habit => {
                  const isCompleted = dayData[habit.id]
                  return (
                    <button
                      key={habit.id}
                      onClick={() => !isFuture && onToggleHabit(dateStr, habit.id)}
                      disabled={isFuture}
                      className={`
                        w-3 h-3 rounded-full transition-all
                        ${isCompleted ? 'scale-110' : 'scale-90 opacity-30'}
                        hover:scale-125 active:scale-100
                        disabled:cursor-not-allowed
                      `}
                      style={{
                        backgroundColor: habit.color,
                        opacity: isCompleted ? 1 : 0.2
                      }}
                      title={`${habit.name} - ${date.toLocaleDateString()}`}
                    />
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
