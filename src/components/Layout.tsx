import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useCurrentUser } from '../hooks/useCurrentUser'

export function Layout() {
  const { clearUser } = useCurrentUser()
  const navigate = useNavigate()

  const handleChangeUser = () => {
    clearUser()
    navigate('/')
  }

  return (
    <div className="layout">
      <main className="layout__content">
        <Outlet />
      </main>
      <nav className="bottom-nav" aria-label="Navegación principal">
        <NavLink to="/fichar" className="bottom-nav__link">
          Fichar
        </NavLink>
        <NavLink to="/historial" className="bottom-nav__link">
          Historial
        </NavLink>
        <NavLink to="/admin" className="bottom-nav__link">
          Admin
        </NavLink>
        <NavLink to="/notificaciones" className="bottom-nav__link">
          Avisos
        </NavLink>
      </nav>
      <button type="button" className="change-user-link" onClick={handleChangeUser}>
        Cambiar usuario
      </button>
    </div>
  )
}
