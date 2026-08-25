import { useEffect, useState } from 'react'
import { BigButton } from '../components/BigButton'
import { DEMO_EMPLOYEES, getEmployeeName } from '../data/employees'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { attendanceService } from '../services/attendanceService'
import type { AttendanceRecord } from '../types/attendance'
import { downloadCsv } from '../utils/csv'
import { formatDateShort, formatTime } from '../utils/date'

type AlertTab = 'all' | 'incomplete' | 'missing'

function getStatusLabel(record: AttendanceRecord): string {
  if (record.checkIn && record.checkOut) return 'Completo'
  if (record.checkIn) return 'Sin salida'
  return 'Sin fichaje'
}

export function AdminPage() {
  const { isAdmin } = useCurrentUser()
  const [employeeFilter, setEmployeeFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [alertTab, setAlertTab] = useState<AlertTab>('all')
  const [, setTick] = useState(0)

  const refresh = () => setTick((t) => t + 1)

  const allRecords = attendanceService.getAllRecords()
  const incompleteRecords = attendanceService.getIncompleteRecords()
  const missingDays = attendanceService.getMissingDays(
    DEMO_EMPLOYEES.map((e) => e.id),
    14,
  )
  const filteredRecords = allRecords.filter((record) => {
    if (employeeFilter && record.employeeId !== employeeFilter) return false
    if (dateFilter && record.date !== dateFilter) return false
    return true
  })

  useEffect(() => {
    const onFocus = () => refresh()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  const handleExport = () => {
    if (!isAdmin) return
    downloadCsv(filteredRecords.length > 0 ? filteredRecords : allRecords)
  }

  return (
    <div className="page admin-page">
      <h1 className="page__title">Admin</h1>
      <p className="page__subtitle">Todos los fichajes (localStorage)</p>

      <div className="filters">
        <label className="filter-field">
          <span>Empleado</span>
          <select
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
          >
            <option value="">Todos</option>
            {DEMO_EMPLOYEES.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </label>
        <label className="filter-field">
          <span>Fecha</span>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </label>
      </div>

      <div className="alert-tabs">
        <button
          type="button"
          className={`alert-tab ${alertTab === 'all' ? 'alert-tab--active' : ''}`}
          onClick={() => setAlertTab('all')}
        >
          Todos ({filteredRecords.length})
        </button>
        <button
          type="button"
          className={`alert-tab ${alertTab === 'incomplete' ? 'alert-tab--active' : ''}`}
          onClick={() => setAlertTab('incomplete')}
        >
          Sin salida ({incompleteRecords.length})
        </button>
        <button
          type="button"
          className={`alert-tab ${alertTab === 'missing' ? 'alert-tab--active' : ''}`}
          onClick={() => setAlertTab('missing')}
        >
          Días sin fichaje ({missingDays.length})
        </button>
      </div>

      {alertTab === 'all' && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Empleado</th>
                <th>Fecha</th>
                <th>Entrada</th>
                <th>Salida</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty-cell">
                    No hay registros.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{getEmployeeName(record.employeeId)}</td>
                    <td>{formatDateShort(record.date)}</td>
                    <td>{record.checkIn ? formatTime(record.checkIn) : '—'}</td>
                    <td>{record.checkOut ? formatTime(record.checkOut) : '—'}</td>
                    <td>{getStatusLabel(record)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {alertTab === 'incomplete' && (
        <div className="alert-list">
          {incompleteRecords.length === 0 ? (
            <p className="empty-state">No hay fichajes sin salida.</p>
          ) : (
            incompleteRecords.map((record) => (
              <div key={record.id} className="alert-item">
                <strong>{getEmployeeName(record.employeeId)}</strong>
                <span>
                  {formatDateShort(record.date)} — Entrada {formatTime(record.checkIn!)}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {alertTab === 'missing' && (
        <div className="alert-list">
          {missingDays.length === 0 ? (
            <p className="empty-state">No se detectaron días sin fichaje.</p>
          ) : (
            missingDays.slice(0, 30).map((item) => (
              <div key={`${item.employeeId}-${item.date}`} className="alert-item">
                <strong>{getEmployeeName(item.employeeId)}</strong>
                <span>{formatDateShort(item.date)} — Sin fichaje</span>
              </div>
            ))
          )}
        </div>
      )}

      {isAdmin ? (
        <div className="admin-actions">
          <BigButton variant="secondary" onClick={handleExport}>
            Exportar CSV
          </BigButton>
        </div>
      ) : (
        <p className="info-box admin-restricted">
          Solo los administradores pueden exportar CSV.
        </p>
      )}
    </div>
  )
}
