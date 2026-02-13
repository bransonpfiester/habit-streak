interface YearGridProps {
  completedDays: Set<string>
  onToggleDay: (date: string) => void
}

export default function YearGrid({ completedDays, onToggleDay }: YearGridProps) {
  // Generate all days of current year
  const generateYearDays = () => {
    const days = []
    const year = new Date().getFullYear()
    const startDate = new Date(year, 0, 1)
    
    // Add empty days for week alignment
    const firstDayOfWeek = startDate.getDay()
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add all days of the year
    for (let i = 0; i < 365; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      days.push(date)
    }
    
    return days
  }

  const days = generateYearDays()
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-6">
      {/* Day of Week Labels */}
      <div className="grid grid-cols-7 gap-2 text-xs text-gray-500 font-medium">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center">{day}</div>
        ))}
      </div>

      {/* Day Grid - 7 columns (week) */}
      <div className="grid grid-cols-7 gap-2 sm:gap-3">
        {days.map((date, idx) => {
          if (!date) {
            return <div key={`empty-${idx}`} className="aspect-square" />
          }

          const dateStr = date.toISOString().split('T')[0]
          const isCompleted = completedDays.has(dateStr)
          const isToday = dateStr === today
          const isFuture = date > new Date()

          return (
            <button
              key={dateStr}
              onClick={() => !isFuture && onToggleDay(dateStr)}
              disabled={isFuture}
              className={`
                aspect-square rounded-md transition-all duration-200 min-h-[32px] sm:min-h-[40px]
                ${isCompleted 
                  ? 'bg-green-500 hover:bg-green-600 shadow-md' 
                  : isFuture
                  ? 'bg-gray-100 cursor-not-allowed opacity-50'
                  : 'bg-gray-200 hover:bg-gray-300 active:bg-gray-400'
                }
                ${isToday && !isCompleted ? 'ring-2 ring-orange-400' : ''}
                ${isCompleted ? 'scale-105' : 'scale-100'}
                hover:scale-110 active:scale-95
                disabled:hover:scale-100
              `}
              title={date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            >
              <span className="text-[10px] sm:text-xs text-gray-600 font-medium">
                {date.getDate()}
              </span>
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600 pt-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-200 rounded-md" />
          <span>Incomplete</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 rounded-md" />
          <span>Complete</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-100 rounded-md opacity-50" />
          <span>Future</span>
        </div>
      </div>
    </div>
  )
}
