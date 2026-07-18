function startOfUtcDay(d: Date) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
}

function utcDayIsoRange(day: Date) {
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
