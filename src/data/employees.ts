import type { AuthUser, Employee } from '../types/attendance'

export const DEMO_EMPLOYEES: Employee[] = [
  { id: 'mariandrea', name: 'Mariandrea', pin: '1001', role: 'admin', contractHoursPerDay: 8 },
  { id: 'macarena', name: 'Macarena', pin: '1002', role: 'employee', contractHoursPerDay: 8 },
  { id: 'ivo', name: 'Ivo', pin: '1003', role: 'admin', contractHoursPerDay: 8 },
  { id: 'javier', name: 'Javier', pin: '2001', role: 'employee', contractHoursPerDay: 8 },
  { id: 'laura', name: 'Laura', pin: '2002', role: 'employee', contractHoursPerDay: 6 },
  { id: 'janet', name: 'Janet', pin: '2003', role: 'employee', contractHoursPerDay: 8 },
  { id: 'meli', name: 'Meli', pin: '2004', role: 'employee', contractHoursPerDay: 8 },
  { id: 'moira', name: 'Moira', pin: '2005', role: 'employee', contractHoursPerDay: 8 },
  { id: 'judit', name: 'Judit', pin: '2006', role: 'employee', contractHoursPerDay: 8 },
  { id: 'elene', name: 'Elene', pin: '2007', role: 'employee', contractHoursPerDay: 8 },
  { id: 'anna', name: 'Anna', pin: '2008', role: 'employee', contractHoursPerDay: 8 },
  { id: 'lydia', name: 'Lydia', pin: '2009', role: 'employee', contractHoursPerDay: 8 },
  { id: 'sarah', name: 'Sarah', pin: '2010', role: 'employee', contractHoursPerDay: 8 },
  { id: 'natalia', name: 'Natalia', pin: '2011', role: 'employee', contractHoursPerDay: 8 },
  { id: 'jaione', name: 'Jaione', pin: '2012', role: 'employee', contractHoursPerDay: 8 },
  { id: 'chus', name: 'Chus', pin: '2013', role: 'employee', contractHoursPerDay: 8 },
]

export function getEmployeeById(id: string): Employee | undefined {
  return DEMO_EMPLOYEES.find((e) => e.id === id)
}

export function getEmployeeName(id: string): string {
  return getEmployeeById(id)?.name ?? id
}

export function authenticateEmployee(id: string, pin: string): AuthUser | null {
  const employee = getEmployeeById(id)
  if (!employee || employee.pin !== pin) return null
  return {
    id: employee.id,
    name: employee.name,
    role: employee.role,
    contractHoursPerDay: employee.contractHoursPerDay,
  }
}

export function isAdmin(user: AuthUser | null): boolean {
  return user?.role === 'admin'
}
