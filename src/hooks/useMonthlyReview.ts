import { useEffect } from 'react'
import { monthlyReviewService } from '../services/monthlyReviewService'

export function useMonthlyReview(employeeId: string | undefined) {
  useEffect(() => {
    if (!employeeId) return
    monthlyReviewService.notifyMonthlyReviewIfNeeded(employeeId).catch(() => {})
  }, [employeeId])
}
