'use client'

import clsx from 'clsx'

const PRIORITIES = [
  { value: 0, label: 'Sin prioridad', color: 'var(--color-muted-foreground)' },
  { value: 1, label: 'P1', color: 'var(--color-state-error)' },
  { value: 2, label: 'P2', color: '#f59e0b' },
  { value: 3, label: 'P3', color: '#3b82f6' },
  { value: 4, label: 'P4', color: '#94a3b8' },
] as const

export function priorityColor(priority: number) {
  return (
    PRIORITIES.find((p) => p.value === priority)?.color ??
    PRIORITIES[0].color
  )
}

type Props = {
  value: number
  onChange: (value: number) => void
}

export function PrioritySelect({ value, onChange }: Props) {
  return (
    <label className="block text-sm text-[var(--color-muted-foreground)]">
      Prioridad
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="border-border-default bg-surface-app text-text-primary mt-1 w-full rounded-md border px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
      >
        {PRIORITIES.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export function PriorityDot({ priority }: { priority: number }) {
  if (!priority) return null
  return (
    <span
      className={clsx('mt-2 size-2 shrink-0 rounded-full')}
      style={{ backgroundColor: priorityColor(priority) }}
      title={`Prioridad P${priority}`}
      aria-hidden
    />
  )
}
