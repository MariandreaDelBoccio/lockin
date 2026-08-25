import { useState } from 'react'
import { AttendanceStatus } from '../components/AttendanceStatus'
import { BigButton } from '../components/BigButton'
import { ErrorBanner } from '../components/ErrorBanner'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useTodayAttendance } from '../hooks/useTodayAttendance'
import { attendanceService } from '../services/attendanceService'

export function HomePage() {
  const { user } = useCurrentUser()
  const { record, status, refresh } = useTodayAttendance(user?.id)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!user) return null

  const handleCheckIn = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    setError(null)
    try {
      const result = attendanceService.checkIn(user.id)
      if (!result.success) {
        setError(result.error.message)
      } else {
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
      const result = attendanceService.checkOut(user.id)
      if (!result.success) {
        setError(result.error.message)
      } else {
        refresh()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page home-page">
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      <AttendanceStatus status={status} record={record} employeeName={user.name} />

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
