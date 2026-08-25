import type { Employee } from '../types/attendance'

export const DEMO_EMPLOYEES: Employee[] = [
  { id: 'ana', name: 'Ana' },
  { id: 'carlos', name: 'Carlos' },
  { id: 'maria', name: 'María' },
  { id: 'juan', name: 'Juan' },
  { id: 'pedro', name: 'Pedro' },
]

export function getEmployeeById(id: string): Employee | undefined {
  return DEMO_EMPLOYEES.find((e) => e.id === id)
}

export function getEmployeeName(id: string): string {
  return getEmployeeById(id)?.name ?? id
}
