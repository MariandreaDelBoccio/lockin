import type { AttendanceRecord } from '../types/attendance'

export interface AttendanceRepository {
  getAll(): AttendanceRecord[]
  getByEmployee(employeeId: string): AttendanceRecord[]
  getByEmployeeAndDate(employeeId: string, date: string): AttendanceRecord | null
  save(record: AttendanceRecord): void
  update(record: AttendanceRecord): void
}
