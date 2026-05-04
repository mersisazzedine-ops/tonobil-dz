'use client'

import { useState, useEffect } from 'react'
import { getTimeRemaining } from '@/lib/utils'

export function useCountdownTimer(endDate: Date) {
  const [timeRemaining, setTimeRemaining] = useState(() => getTimeRemaining(endDate))

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining(endDate))
    }, 1000)

    return () => clearInterval(interval)
  }, [endDate])

  return timeRemaining
}
