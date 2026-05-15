'use client'

import { useCookies } from '@/lib/CookieContext'

/**
 * Debug component to show current cookie preferences
 * Remove or hide in production
 */
export default function CookieStatus() {
  const { preferences, hasConsent, openSettings } = useCookies()

  // Only show in development
  if (process.env.NODE_ENV === 'production') return null

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-4 text-xs max-w-xs z-40">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-gray-900">Cookie Status (Dev)</h3>
        <button
          onClick={openSettings}
          className="text-gray-600 hover:text-gray-900"
          title="Öppna inställningar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Consent:</span>
          <span className={hasConsent ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
            {hasConsent ? '✓' : '✗'}
          </span>
        </div>
        
        <div className="border-t border-gray-200 pt-1 mt-1">
          {Object.entries(preferences).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-gray-600 capitalize">{key}:</span>
              <span className={value ? 'text-green-600' : 'text-gray-400'}>
                {value ? '✓' : '✗'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
