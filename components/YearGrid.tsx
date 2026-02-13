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
      {/* Month Labels */}
      <div className="grid grid-cols-12 gap-2 text-xs text-gray-500 font-medium">
        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
          <div key={month} className="text-center">{month}</div>
        ))}
      </div>

      {/* Day Grid */}
      <div className="grid grid-cols-[repeat(53,minmax(0,1fr))] gap-1">
        {days.map((date) => {
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
                aspect-square rounded-sm transition-all duration-200
                ${isCompleted 
                  ? 'bg-green-500 hover:bg-green-600 shadow-sm' 
                  : isFuture
                  ? 'bg-gray-100 cursor-not-allowed'
                  : 'bg-gray-200 hover:bg-gray-300'
                }
                ${isToday && !isCompleted ? 'ring-2 ring-orange-400 ring-offset-2' : ''}
                ${isCompleted ? 'scale-105' : 'scale-100'}
                hover:scale-110
                disabled:hover:scale-100
              `}
              title={date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            />
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-sm text-gray-600 pt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded-sm" />
          <span>Incomplete</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-sm" />
          <span>Complete</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 rounded-sm" />
          <span>Future</span>
        </div>
      </div>
    </div>
  )
}
