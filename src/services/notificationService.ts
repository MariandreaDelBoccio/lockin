import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storage'

export type NotificationPermissionStatus = NotificationPermission | 'unsupported'

export interface NotificationService {
  getPermissionStatus(): NotificationPermissionStatus
  requestPermission(): Promise<NotificationPermission>
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
    return permission
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
