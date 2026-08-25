import { useState } from 'react'
import type { Employee } from '../types/attendance'

interface LoginFormProps {
  employee: Employee
  onLogin: (pin: string) => boolean
  onCancel: () => void
}

export function LoginForm({ employee, onLogin, onCancel }: LoginFormProps) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pin.trim()) {
      setError('Introduce tu PIN')
      return
    }
    const success = onLogin(pin.trim())
    if (!success) {
      setError('PIN incorrecto')
      setPin('')
    }
  }

  return (
    <div className="login-overlay">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-form__title">Hola, {employee.name}</h2>
        <p className="login-form__subtitle">Introduce tu PIN para continuar</p>

        <label className="filter-field">
          <span>PIN</span>
          <input
            type="password"
            inputMode="numeric"
            autoComplete="current-password"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value)
              setError(null)
            }}
            placeholder="••••"
            autoFocus
          />
        </label>

        {error && <p className="login-form__error">{error}</p>}

        <div className="login-form__actions">
          <button type="button" className="login-form__cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="login-form__submit">
            Entrar
          </button>
        </div>
      </form>
    </div>
  )
}
