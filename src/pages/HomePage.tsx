import { useState } from 'react'
import { AttendanceStatus } from '../components/AttendanceStatus'
import { BigButton } from '../components/BigButton'
import { ErrorBanner } from '../components/ErrorBanner'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useTodayAttendance } from '../hooks/useTodayAttendance'
import { attendanceService } from '../services/attendanceService'
import { combineDateAndTime, getCurrentTimeString, getTodayDateString } from '../utils/date'

export function HomePage() {
  const { user } = useCurrentUser()
  const { record, status, refresh } = useTodayAttendance(user?.id)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [useCustomTime, setUseCustomTime] = useState(false)
  const [customTime, setCustomTime] = useState(getCurrentTimeString)

  if (!user) return null

  const getTimestamp = () => {
    if (!useCustomTime) return undefined
    return combineDateAndTime(getTodayDateString(), customTime)
  }

  const handleCheckIn = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    setError(null)
    try {
      const result = attendanceService.checkIn(user.id, getTimestamp())
      if (!result.success) {
        setError(result.error.message)
      } else {
        setUseCustomTime(false)
        setCustomTime(getCurrentTimeString())
        refresh()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCheckOut = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    setError(null)
    try {
      const result = attendanceService.checkOut(user.id, getTimestamp())
      if (!result.success) {
        setError(result.error.message)
      } else {
        setUseCustomTime(false)
        setCustomTime(getCurrentTimeString())
        refresh()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const showActions = status === 'not_started' || status === 'in_progress'

  return (
    <div className="page home-page">
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      <AttendanceStatus status={status} record={record} employeeName={user.name} />

      {showActions && (
        <div className="time-picker">
          <label className="time-picker__toggle">
            <input
              type="checkbox"
              checked={useCustomTime}
              onChange={(e) => {
                setUseCustomTime(e.target.checked)
                if (e.target.checked) setCustomTime(getCurrentTimeString())
              }}
            />
            <span>Fichar con otra hora</span>
          </label>
          {useCustomTime && (
            <label className="filter-field">
              <span>Hora</span>
              <input
                type="time"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
              />
            </label>
          )}
        </div>
      )}

      <div className="home-page__action">
        {status === 'not_started' && (
          <BigButton onClick={handleCheckIn} disabled={isSubmitting}>
            {isSubmitting ? 'Fichando…' : 'FICHAR ENTRADA'}
          </BigButton>
        )}
        {status === 'in_progress' && (
          <BigButton onClick={handleCheckOut} disabled={isSubmitting} variant="secondary">
            {isSubmitting ? 'Fichando…' : 'FICHAR SALIDA'}
          </BigButton>
        )}
      </div>
    </div>
  )
}
