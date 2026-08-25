import { getEmployeeName } from '../data/employees'
import type { AttendanceRecord } from '../types/attendance'
import { formatDateShort, formatTime } from './date'

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function getRecordStatusLabel(record: AttendanceRecord): string {
  if (record.checkIn && record.checkOut) return 'Completo'
  if (record.checkIn) return 'Sin salida'
  return 'Sin fichaje'
}

export function recordsToCsv(records: AttendanceRecord[]): string {
  const header = 'Empleado,Fecha,Entrada,Salida,Estado'
  const rows = records.map((record) => {
    const employee = getEmployeeName(record.employeeId)
    const date = formatDateShort(record.date)
    const checkIn = record.checkIn ? formatTime(record.checkIn) : ''
    const checkOut = record.checkOut ? formatTime(record.checkOut) : ''
    const status = getRecordStatusLabel(record)
    return [employee, date, checkIn, checkOut, status].map(escapeCsv).join(',')
  })
  return [header, ...rows].join('\n')
}

export function downloadCsv(records: AttendanceRecord[], filename?: string): void {
  const csv = recordsToCsv(records)
  const bom = '\uFEFF'
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename ?? `fichajes-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
