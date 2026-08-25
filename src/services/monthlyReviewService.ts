import { getEmployeeById } from '../data/employees'
import type { MonthlyReview, MonthlyReviewIssue } from '../types/attendance'
import {
  formatDateShort,
  formatMonthYear,
  getMonthWeekdayDates,
  getTodayDateString,
  getWorkedHours,
} from '../utils/date'
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storage'
import { attendanceService } from './attendanceService'
import { notificationService } from './notificationService'

const HOURS_TOLERANCE = 0.5

function getPreviousMonth(): { year: number; month: number } {
  const now = new Date()
  const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()
  const month = now.getMonth() === 0 ? 12 : now.getMonth()
  return { year, month }
}

function shouldRunMonthlyReview(): boolean {
  const today = new Date()
  const day = today.getDate()
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()

  // Últimos 3 días del mes o primeros 5 días del mes siguiente
  return day >= lastDayOfMonth - 2 || day <= 5
}

export function buildMonthlyReview(
  employeeId: string,
  year: number,
  month: number,
): MonthlyReview {
  const employee = getEmployeeById(employeeId)
  const contractHoursPerDay = employee?.contractHoursPerDay ?? 8
  const today = getTodayDateString()
  const isCurrentMonth =
    year === new Date().getFullYear() && month === new Date().getMonth() + 1
  const upToDate = isCurrentMonth ? today : undefined

  const weekdayDates = getMonthWeekdayDates(year, month, upToDate)
  const records = attendanceService.getEmployeeHistory(employeeId)
  const monthRecords = records.filter((r) => r.date.startsWith(`${year}-${String(month).padStart(2, '0')}`))

  const issues: MonthlyReviewIssue[] = []
  let workedHours = 0

  for (const date of weekdayDates) {
    const record = monthRecords.find((r) => r.date === date)
    if (!record?.checkIn) {
      issues.push({
        type: 'missing_day',
        date,
        message: `${formatDateShort(date)}: sin fichaje`,
      })
      continue
    }
    if (!record.checkOut) {
      issues.push({
        type: 'incomplete',
        date,
        message: `${formatDateShort(date)}: entrada sin salida`,
      })
      continue
    }
    workedHours += getWorkedHours(record.checkIn, record.checkOut)
  }

  const expectedHours = weekdayDates.length * contractHoursPerDay
  const hoursDiff = Math.abs(expectedHours - workedHours)

  if (hoursDiff > HOURS_TOLERANCE && weekdayDates.length > 0) {
    issues.push({
      type: 'hours_mismatch',
      message: `Horas trabajadas (${workedHours.toFixed(1)}h) vs contrato (${expectedHours.toFixed(1)}h)`,
    })
  }

  return {
    year,
    month,
    employeeId,
    expectedHours,
    workedHours,
    workingDays: weekdayDates.length,
    issues,
  }
}

function getReviewKey(year: number, month: number, employeeId: string): string {
  return `${year}-${month}-${employeeId}`
}

function wasAlreadyNotified(year: number, month: number, employeeId: string): boolean {
  const notified = getStorageItem<Record<string, string>>(STORAGE_KEYS.lastMonthlyReviewNotified) ?? {}
  return notified[getReviewKey(year, month, employeeId)] != null
}

function markNotified(year: number, month: number, employeeId: string): void {
  const notified = getStorageItem<Record<string, string>>(STORAGE_KEYS.lastMonthlyReviewNotified) ?? {}
  notified[getReviewKey(year, month, employeeId)] = new Date().toISOString()
  setStorageItem(STORAGE_KEYS.lastMonthlyReviewNotified, notified)
}

export async function notifyMonthlyReviewIfNeeded(employeeId: string): Promise<MonthlyReview | null> {
  if (!shouldRunMonthlyReview()) return null
  if (notificationService.getPermissionStatus() !== 'granted') return null

  const { year, month } = getPreviousMonth()
  if (wasAlreadyNotified(year, month, employeeId)) return null

  const review = buildMonthlyReview(employeeId, year, month)
  if (review.issues.length === 0) {
    markNotified(year, month, employeeId)
    return review
  }

  const monthLabel = formatMonthYear(year, month)
  const title = `Revisión ${monthLabel}`
  const body =
    review.issues.length === 1
      ? review.issues[0].message
      : `${review.issues.length} incidencias en ${monthLabel}. Abre la app para ver el detalle.`

  await notificationService.showNotification(title, body, `monthly-review-${employeeId}`)
  markNotified(year, month, employeeId)
  return review
}

export const monthlyReviewService = {
  buildMonthlyReview,
  notifyMonthlyReviewIfNeeded,
  getPreviousMonth,
}
