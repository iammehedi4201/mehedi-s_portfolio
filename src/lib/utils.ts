import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function timeAgo(input: string | number | Date) {
  const date = new Date(input)
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

  if (Number.isNaN(seconds)) return ""
  if (seconds < 5) return "just now"

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })

  const intervals: [string, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
    ["second", 1],
  ]

  for (const [unit, value] of intervals) {
    const amount = Math.floor(seconds / value)
    if (amount >= 1) {
      // Intl.RelativeTimeFormat expects negative values for past
      // so we negate the amount.
      // @ts-ignore
      return rtf.format(-amount, unit)
    }
  }

  return ""
}
