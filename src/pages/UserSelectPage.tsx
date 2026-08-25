import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EmployeeCard } from '../components/EmployeeCard'
import { LoginForm } from '../components/LoginForm'
import { DEMO_EMPLOYEES } from '../data/employees'
import { useCurrentUser } from '../hooks/useCurrentUser'
import type { Employee } from '../types/attendance'

export function UserSelectPage() {
  const { user, login } = useCurrentUser()
  const navigate = useNavigate()
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  useEffect(() => {
    if (user) {
      navigate('/fichar', { replace: true })
    }
  }, [user, navigate])

  return (
    <div className="page user-select-page">
      <h1 className="page__title">¿Quién eres?</h1>
      <p className="page__subtitle">Selecciona tu nombre e introduce tu PIN</p>
      <div className="employee-grid">
        {DEMO_EMPLOYEES.map((employee) => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            onSelect={setSelectedEmployee}
          />
        ))}
      </div>

      {selectedEmployee && (
        <LoginForm
          employee={selectedEmployee}
          onCancel={() => setSelectedEmployee(null)}
          onLogin={(pin) => {
            const success = login(selectedEmployee.id, pin)
            if (success) {
              navigate('/fichar')
            }
            return success
          }}
        />
      )}
    </div>
  )
}
