import { useCallback, useEffect, useState } from 'react'
import { authenticateEmployee } from '../data/employees'
import type { AuthUser } from '../types/attendance'
import { getStorageItem, removeStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storage'

export function useCurrentUser() {
  const [user, setUser] = useState<AuthUser | null>(() =>
    getStorageItem<AuthUser>(STORAGE_KEYS.currentUser),
  )

  const login = useCallback((employeeId: string, pin: string): boolean => {
    const authUser = authenticateEmployee(employeeId, pin)
    if (!authUser) return false
    setStorageItem(STORAGE_KEYS.currentUser, authUser)
    setUser(authUser)
    return true
  }, [])

  const clearUser = useCallback(() => {
    removeStorageItem(STORAGE_KEYS.currentUser)
    setUser(null)
  }, [])

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.currentUser) {
        setUser(getStorageItem<AuthUser>(STORAGE_KEYS.currentUser))
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  return { user, login, clearUser, isAdmin: user?.role === 'admin' }
}
