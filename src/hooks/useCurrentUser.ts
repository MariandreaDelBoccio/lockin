import { useCallback, useEffect, useState } from 'react'
import type { Employee } from '../types/attendance'
import { getStorageItem, removeStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storage'

export function useCurrentUser() {
  const [user, setUser] = useState<Employee | null>(() =>
    getStorageItem<Employee>(STORAGE_KEYS.currentUser),
  )

  const selectUser = useCallback((employee: Employee) => {
    setStorageItem(STORAGE_KEYS.currentUser, employee)
    setUser(employee)
  }, [])

  const clearUser = useCallback(() => {
    removeStorageItem(STORAGE_KEYS.currentUser)
    setUser(null)
  }, [])

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.currentUser) {
        setUser(getStorageItem<Employee>(STORAGE_KEYS.currentUser))
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  return { user, selectUser, clearUser }
}
