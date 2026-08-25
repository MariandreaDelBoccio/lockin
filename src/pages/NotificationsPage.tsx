import { BigButton } from '../components/BigButton'
import { ErrorBanner } from '../components/ErrorBanner'
import { useNotificationPermission } from '../hooks/useNotificationPermission'

function getStatusDisplay(status: string): { icon: string; label: string; description: string } {
  switch (status) {
    case 'granted':
      return {
        icon: '🔔',
        label: 'Notificaciones activadas',
        description: 'El navegador tiene permiso para enviar notificaciones.',
      }
    case 'denied':
      return {
        icon: '🔕',
        label: 'Notificaciones desactivadas',
        description:
          'Has denegado los permisos. Actívalos desde la configuración del navegador.',
      }
    case 'default':
      return {
        icon: '🔕',
        label: 'Notificaciones desactivadas',
        description: 'Aún no has activado las notificaciones.',
      }
    default:
      return {
        icon: '🔕',
        label: 'No soportadas',
        description: 'Este navegador no soporta notificaciones.',
      }
  }
}

export function NotificationsPage() {
  const { status, loading, error, requestPermission } = useNotificationPermission()
  const display = getStatusDisplay(status)

  return (
    <div className="page notifications-page">
      <h1 className="page__title">Notificaciones</h1>

      <div className="notification-status">
        <span className="notification-status__icon">{display.icon}</span>
        <p className="notification-status__label">{display.label}</p>
        <p className="notification-status__desc">{display.description}</p>
      </div>

      {error && <ErrorBanner message={error} />}

      {status !== 'unsupported' && status !== 'granted' && (
        <BigButton onClick={requestPermission} disabled={loading}>
          {loading ? 'Solicitando…' : 'Activar notificaciones'}
        </BigButton>
      )}

      <div className="info-box">
        <p>
          Las notificaciones push completas requerirán un backend en una versión futura.
          Por ahora solo comprobamos que la PWA puede solicitar permisos correctamente.
        </p>
      </div>
    </div>
  )
}
