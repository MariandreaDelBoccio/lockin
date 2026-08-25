import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { useCurrentUser } from './hooks/useCurrentUser'
import { AdminPage } from './pages/AdminPage'
import { HistoryPage } from './pages/HistoryPage'
import { HomePage } from './pages/HomePage'
import { NotificationsPage } from './pages/NotificationsPage'
import { UserSelectPage } from './pages/UserSelectPage'

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useCurrentUser()
  if (!isAdmin) {
    return <Navigate to="/fichar" replace />
  }
  return children
}

function ProtectedRoutes() {
  const { user } = useCurrentUser()

  if (!user) {
    return <Navigate to="/" replace />
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/fichar" element={<HomePage />} />
        <Route path="/historial" element={<HistoryPage />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route path="/notificaciones" element={<NotificationsPage />} />
        <Route path="*" element={<Navigate to="/fichar" replace />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<UserSelectPage />} />
      <Route path="/*" element={<ProtectedRoutes />} />
    </Routes>
  )
}
