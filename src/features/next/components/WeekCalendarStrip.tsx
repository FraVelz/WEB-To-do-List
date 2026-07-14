'use client'

import clsx from 'clsx'

const WEEKDAYS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']

type Props = {
  selected: Date
  onSelect: (day: Date) => void
  days?: number
}

function startOfUtcDay(d: Date) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
}

export function WeekCalendarStrip({ selected, onSelect, days = 14 }: Props) {
  const today = startOfUtcDay(new Date())
  const selectedDay = startOfUtcDay(selected)

  const items = Array.from({ length: days }, (_, i) => {
    const day = new Date(today.getTime() + i * 86400000)
    return day
  })

  const monthLabel = selectedDay.toLocaleDateString('es', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })

  return (
    <div className="mt-4 max-w-3xl">
      <p className="text-text-secondary mb-2 text-sm capitalize">
        {monthLabel}
      </p>
      <div className="flex gap-1 overflow-x-auto pb-1">
        {items.map((day) => {
          const isSelected = day.getTime() === selectedDay.getTime()
          const isToday = day.getTime() === today.getTime()
          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onSelect(day)}
              className={clsx(
                'flex min-w-12 flex-col items-center rounded-lg px-2 py-2 text-xs',
                isSelected
                  ? 'bg-interactive-primary text-text-primary'
                  : 'hover:bg-interactive-hover-soft text-text-secondary'
              )}
            >
              <span className="uppercase">{WEEKDAYS[day.getUTCDay()]}</span>
              <span
                className={clsx(
                  'mt-1 text-sm font-semibold',
                  isToday && !isSelected && 'text-interactive-primary'
                )}
              >
                {day.getUTCDate()}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function utcDayIsoRange(day: Date) {
  const start = startOfUtcDay(day)
  const end = new Date(start.getTime() + 86400000)
  return { start, end }
}

export function isSameUtcDay(iso: string | null, day: Date) {
  if (!iso) return false
  const due = new Date(iso)
  const { start, end } = utcDayIsoRange(day)
  return due >= start && due < end
}
