import { BigButton } from '../components/BigButton'
import { ErrorBanner } from '../components/ErrorBanner'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useNotificationPermission } from '../hooks/useNotificationPermission'
import { monthlyReviewService } from '../services/monthlyReviewService'
import { formatMonthYear } from '../utils/date'

function getStatusDisplay(status: string): { icon: string; label: string; description: string } {
  switch (status) {
    case 'granted':
      return {
        icon: '🔔',
        label: 'Notificaciones activadas',
        description: 'Recibirás avisos al final de cada mes si hay incidencias.',
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
        description: 'Actívalas para recibir la revisión mensual de fichajes.',
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
  const { user } = useCurrentUser()
  const { status, loading, error, clearError, requestPermission, sendTestNotification } =
    useNotificationPermission()
  const display = getStatusDisplay(status)

  const { year, month } = monthlyReviewService.getPreviousMonth()
  const review = user ? monthlyReviewService.buildMonthlyReview(user.id, year, month) : null
  const monthLabel = formatMonthYear(year, month)

  return (
    <div className="page notifications-page">
      <h1 className="page__title">Notificaciones</h1>

      <div className="notification-status">
        <span className="notification-status__icon">{display.icon}</span>
        <p className="notification-status__label">{display.label}</p>
        <p className="notification-status__desc">{display.description}</p>
      </div>

      {error && <ErrorBanner message={error} onDismiss={clearError} />}

      {status !== 'unsupported' && status !== 'granted' && (
        <BigButton onClick={requestPermission} disabled={loading}>
          {loading ? 'Solicitando…' : 'Activar notificaciones'}
        </BigButton>
      )}

      {status === 'granted' && (
        <BigButton variant="secondary" onClick={sendTestNotification} disabled={loading}>
          {loading ? 'Enviando…' : 'Enviar notificación de prueba'}
        </BigButton>
      )}

      {review && (
        <div className="monthly-review">
          <h2 className="monthly-review__title">Revisión de {monthLabel}</h2>
          <div className="monthly-review__stats">
            <div>
              <span className="monthly-review__label">Horas trabajadas</span>
              <strong>{review.workedHours.toFixed(1)}h</strong>
            </div>
            <div>
              <span className="monthly-review__label">Horas contrato</span>
              <strong>{review.expectedHours.toFixed(1)}h</strong>
            </div>
            <div>
              <span className="monthly-review__label">Días laborables</span>
              <strong>{review.workingDays}</strong>
            </div>
          </div>
          {review.issues.length === 0 ? (
            <p className="monthly-review__ok">Todo correcto en {monthLabel}.</p>
          ) : (
            <ul className="monthly-review__issues">
              {review.issues.map((issue, i) => (
                <li key={i}>{issue.message}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="info-box">
        <p>
          Al final de cada mes (y primeros días del siguiente) se comprueba si faltan fichajes
          o las horas no coinciden con tu contrato ({user?.contractHoursPerDay ?? 8}h/día).
        </p>
      </div>
    </div>
  )
}
