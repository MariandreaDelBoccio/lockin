import type { Employee } from '../types/attendance'

interface EmployeeCardProps {
  employee: Employee
  onSelect: (employee: Employee) => void
}

export function EmployeeCard({ employee, onSelect }: EmployeeCardProps) {
  const initial = employee.name.charAt(0).toUpperCase()

  return (
    <button
      type="button"
      className="employee-card"
      onClick={() => onSelect(employee)}
    >
      <span className="employee-card__avatar">{initial}</span>
      <span className="employee-card__name">{employee.name}</span>
    </button>
  )
}
