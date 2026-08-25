import { useCallback, useEffect, useState } from 'react'
import {
  notificationService,
  type NotificationPermissionStatus,
} from '../services/notificationService'

export function useNotificationPermission() {
  const [status, setStatus] = useState<NotificationPermissionStatus>(() =>
    notificationService.getPermissionStatus(),
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(() => {
    setStatus(notificationService.getPermissionStatus())
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const requestPermission = async () => {
    setLoading(true)
    setError(null)
    try {
      const permission = await notificationService.requestPermission()
      setStatus(permission)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al solicitar permisos.')
    } finally {
      setLoading(false)
    }
  }

  const sendTestNotification = async () => {
    setLoading(true)
    setError(null)
    try {
      await notificationService.showTestNotification()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar la notificación.')
    } finally {
      setLoading(false)
    }
  }

  return { status, loading, error, clearError: () => setError(null), requestPermission, sendTestNotification, refresh }
}
