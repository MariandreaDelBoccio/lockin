import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storage'

export type NotificationPermissionStatus = NotificationPermission | 'unsupported'

export interface NotificationService {
  getPermissionStatus(): NotificationPermissionStatus
  requestPermission(): Promise<NotificationPermission>
  showTestNotification(): Promise<void>
  subscribeToPush(): Promise<PushSubscription | null>
  wasPermissionRequested(): boolean
  markPermissionRequested(): void
}

class NotificationServiceImpl implements NotificationService {
  getPermissionStatus(): NotificationPermissionStatus {
    if (!('Notification' in window)) return 'unsupported'
    return Notification.permission
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('Este navegador no soporta notificaciones.')
    }
    const permission = await Notification.requestPermission()
    this.markPermissionRequested()
    if (permission === 'granted') {
      await this.showTestNotification()
    }
    return permission
  }

  async showTestNotification(): Promise<void> {
    if (!('Notification' in window)) {
      throw new Error('Este navegador no soporta notificaciones.')
    }
    if (Notification.permission !== 'granted') {
      throw new Error('Primero debes activar las notificaciones.')
    }

    const title = 'Fichaje — prueba'
    const options: NotificationOptions = {
      body: 'Si ves esto, las notificaciones funcionan correctamente.',
      icon: `${import.meta.env.BASE_URL}icons/icon-192.png`,
      badge: `${import.meta.env.BASE_URL}icons/icon-192.png`,
      tag: 'fichaje-test',
    }

    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready
      await registration.showNotification(title, options)
      return
    }

    new Notification(title, options)
  }

  async subscribeToPush(): Promise<PushSubscription | null> {
    throw new Error(
      'Las notificaciones push requieren backend. Disponible en una versión futura.',
    )
  }

  wasPermissionRequested(): boolean {
    return getStorageItem<boolean>(STORAGE_KEYS.notificationPermissionRequested) ?? false
  }

  markPermissionRequested(): void {
    setStorageItem(STORAGE_KEYS.notificationPermissionRequested, true)
  }
}

export const notificationService = new NotificationServiceImpl()
