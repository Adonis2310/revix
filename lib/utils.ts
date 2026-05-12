import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatKm(km: number): string {
  return km.toLocaleString('en-US')
}

export function formatKmShort(km: number): string {
  if (km >= 1000) {
    const val = km / 1000
    return `${Number.isInteger(val) ? val : val.toFixed(1)}k`
  }
  return km.toString()
}

export function getProgressPercent(
  lastServiceKm: number,
  currentKm: number,
  nextServiceKm: number
): number {
  const total = nextServiceKm - lastServiceKm
  const done = currentKm - lastServiceKm
  return Math.min(Math.max((done / total) * 100, 0), 100)
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
