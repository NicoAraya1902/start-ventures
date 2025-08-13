import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPartialName(fullName: string | null | undefined): string {
  if (!fullName) return 'Usuario';
  
  const names = fullName.trim().split(' ');
  if (names.length === 1) return names[0];
  
  const firstName = names[0];
  const lastNameInitial = names[names.length - 1][0];
  
  return `${firstName} ${lastNameInitial}.`;
}
