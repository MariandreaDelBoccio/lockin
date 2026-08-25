export type UserRole = 'admin' | 'employee'

export interface Employee {
  id: string
  name: string
  pin: string
  role: UserRole
  /** Horas de contrato por día laborable (lunes–viernes) */
  contractHoursPerDay: number
}

/** Usuario autenticado (sin PIN en sesión) */
export interface AuthUser {
  id: string
  name: string
  role: UserRole
  contractHoursPerDay: number
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

export interface MonthlyReviewIssue {
  type: 'missing_day' | 'incomplete' | 'hours_mismatch'
  date?: string
  message: string
}

export interface MonthlyReview {
  year: number
  month: number
  employeeId: string
  expectedHours: number
  workedHours: number
  workingDays: number
  issues: MonthlyReviewIssue[]
}
