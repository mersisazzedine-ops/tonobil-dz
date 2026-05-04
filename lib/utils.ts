import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { CURRENCY } from './constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Price formatting
export function formatPrice(priceInDZD: number): string {
  return new Intl.NumberFormat('fr-DZ', {
    style: 'currency',
    currency: CURRENCY.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceInDZD)
}

export function formatPriceShort(priceInDZD: number): string {
  return `${priceInDZD.toLocaleString('fr-DZ')} DA`
}

// Date formatting
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

// Rental calculations
export function calculateDaysRented(startDate: Date, endDate: Date): number {
  const millisecondsPerDay = 24 * 60 * 60 * 1000
  const timeDifference = endDate.getTime() - startDate.getTime()
  return Math.ceil(timeDifference / millisecondsPerDay)
}

export function calculateTotalPrice(
  dailyRate: number,
  days: number,
  serviceFee: number = 0
): number {
  return dailyRate * days + serviceFee
}

export function calculateServiceFee(totalPrice: number, serviceFeePercentage: number = 0.1): number {
  return Math.round(totalPrice * serviceFeePercentage)
}

// Star rating display
export function renderStars(rating: number, maxStars: number = 5): string {
  const filledStars = Math.round(rating)
  return '⭐'.repeat(filledStars) + '☆'.repeat(maxStars - filledStars)
}

// Text truncation
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0].toUpperCase())
    .slice(0, 2)
    .join('')
}

// Phone number formatting
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('213')) {
    const number = cleaned.slice(3)
    return `+213 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`
  }
  return phone
}

// Time remaining
export function getTimeRemaining(endDate: Date): {
  days: number
  hours: number
  minutes: number
  totalSeconds: number
  isExpired: boolean
} {
  const now = new Date()
  const timeDifference = endDate.getTime() - now.getTime()

  if (timeDifference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      totalSeconds: 0,
      isExpired: true,
    }
  }

  const totalSeconds = Math.floor(timeDifference / 1000)
  const days = Math.floor(totalSeconds / (24 * 60 * 60))
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60))
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60)

  return {
    days,
    hours,
    minutes,
    totalSeconds,
    isExpired: false,
  }
}

// Format countdown timer display
export function formatCountdown(endDate: Date): string {
  const { days, hours, minutes, isExpired } = getTimeRemaining(endDate)

  if (isExpired) return 'Expired'
  if (days > 0) return `${days}d ${hours}h remaining`
  if (hours > 0) return `${hours}h ${minutes}m remaining`
  return `${minutes}m remaining`
}
