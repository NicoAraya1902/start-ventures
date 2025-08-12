import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitizes text input by removing HTML tags and limiting length
 */
export function sanitizeText(text: string, maxLength: number = 1000): string {
  if (!text) return '';
  
  // Remove HTML tags and decode entities
  const stripped = text.replace(/<[^>]*>/g, '').trim();
  
  // Limit length
  return stripped.slice(0, maxLength);
}

/**
 * Sanitizes user input for safe display in the UI
 */
export function sanitizeUserInput(input: string): string {
  if (!input) return '';
  
  // Basic XSS prevention - escape HTML characters
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validates and sanitizes email addresses
 */
export function sanitizeEmail(email: string): string {
  if (!email) return '';
  
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmed = email.trim().toLowerCase();
  
  if (!emailRegex.test(trimmed)) {
    throw new Error('Invalid email format');
  }
  
  return trimmed.slice(0, 254); // Email max length
}

/**
 * Validates and sanitizes phone numbers
 */
export function sanitizePhone(phone: string): string {
  if (!phone) return '';
  
  // Remove all non-digit characters except + and spaces
  const cleaned = phone.replace(/[^\d+\s-()]/g, '');
  
  return cleaned.slice(0, 20); // Reasonable phone length limit
}