import type { AttendanceRecord } from '../types/attendance'
import type { AttendanceStatus as Status } from '../types/attendance'
import { formatDateSpanish, formatDuration, formatTime, getTodayDateString } from '../utils/date'

interface AttendanceStatusProps {
  status: Status
  record: AttendanceRecord | null
  employeeName: string
}

export function AttendanceStatus({ status, record, employeeName }: AttendanceStatusProps) {
  const todayLabel = formatDateSpanish(record?.date ?? getTodayDateString())

  if (status === 'not_started') {
    return (
      <div className="attendance-status">
        <p className="attendance-status__greeting">Buenos días, {employeeName} 👋</p>
        <p className="attendance-status__date">{todayLabel}</p>
        <p className="attendance-status__hint">Todavía no has fichado.</p>
      </div>
    )
  }

  if (status === 'in_progress' && record?.checkIn) {
    return (
      <div className="attendance-status">
        <p className="attendance-status__badge attendance-status__badge--active">
          🟢 Jornada iniciada
        </p>
        <div className="attendance-status__row">
          <span className="attendance-status__label">Entrada</span>
          <span className="attendance-status__value">{formatTime(record.checkIn)}</span>
        </div>
      </div>
    )
  }

  if (status === 'completed' && record?.checkIn && record?.checkOut) {
    return (
      <div className="attendance-status">
        <p className="attendance-status__badge attendance-status__badge--done">
          ✓ Jornada finalizada
        </p>
        <div className="attendance-status__row">
          <span className="attendance-status__label">Entrada</span>
          <span className="attendance-status__value">{formatTime(record.checkIn)}</span>
        </div>
        <div className="attendance-status__row">
          <span className="attendance-status__label">Salida</span>
          <span className="attendance-status__value">{formatTime(record.checkOut)}</span>
        </div>
        <div className="attendance-status__duration">
          <span className="attendance-status__label">Horas trabajadas</span>
          <span className="attendance-status__value attendance-status__value--large">
            {formatDuration(record.checkIn, record.checkOut)}
          </span>
        </div>
      </div>
    )
  }

  return null
}
