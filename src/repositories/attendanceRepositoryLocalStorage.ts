import type { AttendanceRecord } from '../types/attendance'
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storage'
import type { AttendanceRepository } from './attendanceRepository'

function loadRecords(): AttendanceRecord[] {
  return getStorageItem<AttendanceRecord[]>(STORAGE_KEYS.attendanceRecords) ?? []
}

function persistRecords(records: AttendanceRecord[]): void {
  setStorageItem(STORAGE_KEYS.attendanceRecords, records)
}

export class AttendanceRepositoryLocalStorage implements AttendanceRepository {
  getAll(): AttendanceRecord[] {
    return loadRecords()
  }

  getByEmployee(employeeId: string): AttendanceRecord[] {
    return loadRecords().filter((r) => r.employeeId === employeeId)
  }

  getByEmployeeAndDate(employeeId: string, date: string): AttendanceRecord | null {
    return (
      loadRecords().find((r) => r.employeeId === employeeId && r.date === date) ?? null
    )
  }

  save(record: AttendanceRecord): void {
    const records = loadRecords()
    records.push(record)
    persistRecords(records)
  }

  update(record: AttendanceRecord): void {
    const records = loadRecords()
    const index = records.findIndex((r) => r.id === record.id)
    if (index === -1) {
      records.push(record)
    } else {
      records[index] = record
    }
    persistRecords(records)
  }
}

export const attendanceRepository = new AttendanceRepositoryLocalStorage()
