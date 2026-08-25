import { useEffect, useState } from 'react'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { attendanceService } from '../services/attendanceService'
import type { AttendanceRecord } from '../types/attendance'
import { formatDateShort, formatDuration, formatTime } from '../utils/date'

export function HistoryPage() {
  const { user } = useCurrentUser()
  const [records, setRecords] = useState<AttendanceRecord[]>([])

  useEffect(() => {
    if (!user) {
      setRecords([])
      return
    }
    setRecords(attendanceService.getEmployeeHistory(user.id))
  }, [user])

  if (!user) return null

  return (
    <div className="page history-page">
      <h1 className="page__title">Historial</h1>
      <p className="page__subtitle">Tus últimos fichajes</p>

      {records.length === 0 ? (
        <p className="empty-state">No hay fichajes registrados.</p>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Entrada</th>
                <th>Salida</th>
                <th>Duración</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>{formatDateShort(record.date)}</td>
                  <td>{record.checkIn ? formatTime(record.checkIn) : '—'}</td>
                  <td>{record.checkOut ? formatTime(record.checkOut) : '—'}</td>
                  <td>
                    {record.checkIn && record.checkOut
                      ? formatDuration(record.checkIn, record.checkOut)
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
