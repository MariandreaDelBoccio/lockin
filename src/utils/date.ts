const DATE_LOCALE = 'es-ES'

export function getTodayDateString(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatDateSpanish(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const formatted = date.toLocaleDateString(DATE_LOCALE, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

export function formatDateShort(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString(DATE_LOCALE, {
    day: '2-digit',
    month: '2-digit',
  })
}

export function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString(DATE_LOCALE, {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDuration(checkIn: string, checkOut: string): string {
  const start = new Date(checkIn).getTime()
  const end = new Date(checkOut).getTime()
  const diffMs = Math.max(0, end - start)
  const totalMinutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours}h ${minutes}m`
}

export function getRecordStatus(
  checkIn: string | null,
  checkOut: string | null,
): 'not_started' | 'in_progress' | 'completed' {
  if (!checkIn) return 'not_started'
  if (!checkOut) return 'in_progress'
  return 'completed'
}

export function getWeekdayDates(daysBack: number): string[] {
  const dates: string[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < daysBack; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const day = d.getDay()
    if (day >= 1 && day <= 5) {
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const dayNum = String(d.getDate()).padStart(2, '0')
      dates.push(`${year}-${month}-${dayNum}`)
    }
  }

  return dates
}
