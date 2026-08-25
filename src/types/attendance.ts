export interface Employee {
  id: string
  name: string
}

export interface AttendanceRecord {
  id: string
  employeeId: string
  date: string
  checkIn: string | null
  checkOut: string | null
  createdAt: string
  updatedAt: string
}

export type AttendanceStatus = 'not_started' | 'in_progress' | 'completed'

export interface AttendanceError {
  code: string
  message: string
}

export type AttendanceResult<T> =
  | { success: true; data: T }
  | { success: false; error: AttendanceError }
