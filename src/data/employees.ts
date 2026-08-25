import type { Employee } from '../types/attendance'

export const DEMO_EMPLOYEES: Employee[] = [
  { id: 'mariandrea', name: 'Mariandrea' },
  { id: 'macarena', name: 'Macarena' },
  { id: 'ivo', name: 'Ivo' },
  { id: 'javier', name: 'Javier' },
  { id: 'laura', name: 'Laura' },
  { id: 'janet', name: 'Janet' },
  { id: 'meli', name: 'Meli' },
  { id: 'moira', name: 'Moira' },
  { id: 'judit', name: 'Judit' },
  { id: 'elene', name: 'Elene' },
  { id: 'anna', name: 'Anna' },
  { id: 'lydia', name: 'Lydia' },
  { id: 'sarah', name: 'Sarah' },
  { id: 'natalia', name: 'Natalia' },
  { id: 'jaione', name: 'Jaione' },
  { id: 'chus', name: 'Chus' },
]

export function getEmployeeById(id: string): Employee | undefined {
  return DEMO_EMPLOYEES.find((e) => e.id === id)
}

export function getEmployeeName(id: string): string {
  return getEmployeeById(id)?.name ?? id
}
