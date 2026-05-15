'use client'

import { useCookies, CookiePreferences } from '@/lib/CookieContext'
import { useLanguage } from '@/lib/LanguageContext'
import { useState, useEffect, useMemo } from 'react'

export default function CookieSettings() {
  const { showSettings, closeSettings, preferences, updatePreferences, acceptAll, rejectAll } = useCookies()
  const { t } = useLanguage()
  const [localPrefs, setLocalPrefs] = useState<CookiePreferences>(preferences)

  useEffect(() => {
    setLocalPrefs(preferences)
  }, [preferences])

  const cookieCategories = useMemo(
    () =>
      [
        {
          id: 'necessary' as const,
          title: t('necessaryCookies'),
          description: t('necessaryCookiesText1'),
          required: true,
        },
        {
          id: 'functional' as const,
          title: t('functionalCookies'),
          description: t('functionalCookiesText1'),
          required: false,
        },
        {
          id: 'analytics' as const,
          title: t('analyticalCookies'),
          description: t('analyticalCookiesText1'),
          required: false,
        },
        {
          id: 'marketing' as const,
          title: t('marketingCookies'),
          description: t('marketingCookiesText1'),
          required: false,
        },
      ] as const,
    [t]
  )

  const handleToggle = (category: keyof CookiePreferences) => {
    if (category === 'necessary') return // Can't toggle necessary cookies
    setLocalPrefs(prev => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const handleSave = () => {
    updatePreferences(localPrefs)
    closeSettings()
  }

  if (!showSettings) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-40 z-50 transition-opacity backdrop-blur-sm"
        onClick={closeSettings}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{t('cookieSettings')}</h2>
                <p className="text-sm text-gray-500 mt-1">{t('cookieSettingsSubtitle')}</p>
              </div>
              <button
                onClick={closeSettings}
                className="text-gray-400 hover:text-gray-600 transition-colors -mt-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-8 py-6">
            <div className="space-y-6">
              {cookieCategories.map((category) => (
                <div
                  key={category.id}
                  className="pb-6 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-sm font-medium text-gray-900">
                          {category.title}
                        </h3>
                        {category.required && (
                          <span className="text-xs text-gray-500">
                            {t('cookieRequiredBadge')}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                    
                    <div className="flex-shrink-0 pt-0.5">
                      <button
                        onClick={() => handleToggle(category.id)}
                        disabled={category.required}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          localPrefs[category.id]
                            ? 'bg-black'
                            : 'bg-gray-200'
                        } ${category.required ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                            localPrefs[category.id] ? 'translate-x-5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-5 border-t border-gray-100 bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={rejectAll}
                className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                {t('cookieRejectAll')}
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 transition-colors"
              >
                {t('cookieSave')}
              </button>
              <button
                onClick={acceptAll}
                className="px-5 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 transition-colors"
              >
                {t('cookieAcceptAll')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
