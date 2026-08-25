import { useCallback, useEffect, useState } from 'react'
import type { AttendanceRecord } from '../types/attendance'
import { attendanceService, getAttendanceStatus } from '../services/attendanceService'

export function useTodayAttendance(employeeId: string | undefined) {
  const [record, setRecord] = useState<AttendanceRecord | null>(null)

  const refresh = useCallback(() => {
    if (!employeeId) {
      setRecord(null)
      return
    }
    setRecord(attendanceService.getTodayRecord(employeeId))
  }, [employeeId])

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, 60_000)
    return () => clearInterval(interval)
  }, [refresh])

  const status = getAttendanceStatus(record)

  return { record, status, refresh }
}
