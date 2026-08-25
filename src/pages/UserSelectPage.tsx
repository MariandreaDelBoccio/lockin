import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { EmployeeCard } from '../components/EmployeeCard'
import { DEMO_EMPLOYEES } from '../data/employees'
import { useCurrentUser } from '../hooks/useCurrentUser'

export function UserSelectPage() {
  const { user, selectUser } = useCurrentUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/fichar', { replace: true })
    }
  }, [user, navigate])

  return (
    <div className="page user-select-page">
      <h1 className="page__title">¿Quién eres?</h1>
      <p className="page__subtitle">Selecciona tu nombre para fichar</p>
      <div className="employee-grid">
        {DEMO_EMPLOYEES.map((employee) => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            onSelect={(e) => {
              selectUser(e)
              navigate('/fichar')
            }}
          />
        ))}
      </div>
    </div>
  )
}
