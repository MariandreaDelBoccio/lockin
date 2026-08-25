const STORAGE_KEYS = {
  currentUser: 'fichaje_current_user',
  attendanceRecords: 'attendance_records',
  notificationPermissionRequested: 'notification_permission_requested',
} as const

export { STORAGE_KEYS }

export function getStorageItem<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function removeStorageItem(key: string): void {
  localStorage.removeItem(key)
}
