import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// This is the cn (className merge) utility function
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Email validation utility
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

