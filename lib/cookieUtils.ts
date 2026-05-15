import { CookiePreferences } from './CookieContext'

/**
 * Check if a specific cookie category is allowed
 */
export function isCookieAllowed(category: keyof CookiePreferences): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    const prefs = localStorage.getItem('cookie-preferences')
    if (!prefs) return false
    
    const preferences: CookiePreferences = JSON.parse(prefs)
    return preferences[category] === true
  } catch {
    return false
  }
}

/**
 * Set a cookie with proper consent checking
 */
export function setCookie(
  name: string,
  value: string,
  category: keyof CookiePreferences,
  days: number = 365
): boolean {
  // Always allow necessary cookies
  if (category !== 'necessary' && !isCookieAllowed(category)) {
    return false
  }

  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
  return true
}

/**
 * Get a cookie value
 */
export function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null
  
  const nameEQ = name + '='
  const ca = document.cookie.split(';')
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  
  return null
}

/**
 * Delete a cookie
 */
export function deleteCookie(name: string): void {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
}

/**
 * Load Google Analytics only if analytics cookies are allowed
 */
export function loadGoogleAnalytics(measurementId: string): void {
  if (!isCookieAllowed('analytics')) return

  // Load GA script
  const script = document.createElement('script')
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  script.async = true
  document.head.appendChild(script)

  // Initialize GA
  window.dataLayer = window.dataLayer || []
  function gtag(...args: any[]) {
    window.dataLayer.push(args)
  }
  gtag('js', new Date())
  gtag('config', measurementId)
}

/**
 * Load Facebook Pixel only if marketing cookies are allowed
 */
export function loadFacebookPixel(pixelId: string): void {
  if (!isCookieAllowed('marketing')) return

  // Load FB Pixel script
  ;(function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return
    n = f.fbq = function() {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    }
    if (!f._fbq) f._fbq = n
    n.push = n
    n.loaded = !0
    n.version = '2.0'
    n.queue = []
    t = b.createElement(e)
    t.async = !0
    t.src = v
    s = b.getElementsByTagName(e)[0]
    s.parentNode.insertBefore(t, s)
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')

  window.fbq('init', pixelId)
  window.fbq('track', 'PageView')
}

// Type declarations for global objects
declare global {
  interface Window {
    dataLayer: any[]
    fbq: any
    _fbq: any
  }
}
