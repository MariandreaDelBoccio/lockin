import type { AttendanceRecord, AttendanceResult } from '../types/attendance'
import type { AttendanceRepository } from '../repositories/attendanceRepository'
import { attendanceRepository } from '../repositories/attendanceRepositoryLocalStorage'
import { getRecordStatus, getTodayDateString, getWeekdayDates } from '../utils/date'

export class AttendanceService {
  private repository: AttendanceRepository

  constructor(repository: AttendanceRepository) {
    this.repository = repository
  }

  getTodayRecord(employeeId: string): AttendanceRecord | null {
    return this.repository.getByEmployeeAndDate(employeeId, getTodayDateString())
  }

  getEmployeeHistory(employeeId: string): AttendanceRecord[] {
    return this.repository
      .getByEmployee(employeeId)
      .sort((a, b) => b.date.localeCompare(a.date))
  }

  getAllRecords(): AttendanceRecord[] {
    return this.repository.getAll().sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date)
      if (dateCompare !== 0) return dateCompare
      return a.employeeId.localeCompare(b.employeeId)
    })
  }

  checkIn(employeeId: string, timestamp?: string): AttendanceResult<AttendanceRecord> {
    const today = getTodayDateString()
    const existing = this.repository.getByEmployeeAndDate(employeeId, today)

    if (existing?.checkIn) {
      return {
        success: false,
        error: {
          code: 'ALREADY_CHECKED_IN',
          message: 'Ya has fichado la entrada hoy.',
        },
      }
    }

    const now = timestamp ?? new Date().toISOString()
    if (new Date(now).getTime() > Date.now()) {
      return {
        success: false,
        error: {
          code: 'FUTURE_TIME',
          message: 'No puedes fichar con una hora futura.',
        },
      }
    }
    const record: AttendanceRecord = existing
      ? { ...existing, checkIn: now, updatedAt: now }
      : {
          id: crypto.randomUUID(),
          employeeId,
          date: today,
          checkIn: now,
          checkOut: null,
          createdAt: now,
          updatedAt: now,
        }

    if (existing) {
      this.repository.update(record)
    } else {
      this.repository.save(record)
    }

    return { success: true, data: record }
  }

  checkOut(employeeId: string, timestamp?: string): AttendanceResult<AttendanceRecord> {
    const today = getTodayDateString()
    const existing = this.repository.getByEmployeeAndDate(employeeId, today)

    if (!existing?.checkIn) {
      return {
        success: false,
        error: {
          code: 'NO_CHECK_IN',
          message: 'Debes fichar la entrada antes de la salida.',
        },
      }
    }

    if (existing.checkOut) {
      return {
        success: false,
        error: {
          code: 'ALREADY_CHECKED_OUT',
          message: 'Ya has fichado la salida hoy.',
        },
      }
    }

    const now = timestamp ?? new Date().toISOString()
    if (new Date(now).getTime() > Date.now()) {
      return {
        success: false,
        error: {
          code: 'FUTURE_TIME',
          message: 'No puedes fichar con una hora futura.',
        },
      }
    }
    if (new Date(now).getTime() <= new Date(existing.checkIn).getTime()) {
      return {
        success: false,
        error: {
          code: 'CHECKOUT_BEFORE_CHECKIN',
          message: 'La salida debe ser posterior a la entrada.',
        },
      }
    }
    const record: AttendanceRecord = { ...existing, checkOut: now, updatedAt: now }
    this.repository.update(record)

    return { success: true, data: record }
  }

  getIncompleteRecords(): AttendanceRecord[] {
    return this.repository
      .getAll()
      .filter((r) => r.checkIn && !r.checkOut)
      .sort((a, b) => b.date.localeCompare(a.date))
  }

  getMissingDays(employeeIds: string[], daysBack = 14): { employeeId: string; date: string }[] {
    const weekdayDates = getWeekdayDates(daysBack)
    const allRecords = this.repository.getAll()
    const missing: { employeeId: string; date: string }[] = []

    for (const employeeId of employeeIds) {
      for (const date of weekdayDates) {
        const record = allRecords.find(
          (r) => r.employeeId === employeeId && r.date === date,
        )
        if (!record?.checkIn) {
          missing.push({ employeeId, date })
        }
      }
    }

    return missing.sort((a, b) => b.date.localeCompare(a.date))
  }
}

export function getAttendanceStatus(record: AttendanceRecord | null) {
  if (!record) return 'not_started' as const
  return getRecordStatus(record.checkIn, record.checkOut)
}

export const attendanceService = new AttendanceService(attendanceRepository)
