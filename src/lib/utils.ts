import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to get the correct base path for assets
export function getAssetPath(path: string): string {
  const basePath = process.env.NODE_ENV === 'production' ? '/bds-website' : ''
  return `${basePath}${path}`
}
