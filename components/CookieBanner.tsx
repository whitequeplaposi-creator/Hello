'use client'

import { useCookies } from '@/lib/CookieContext'
import { useLanguage } from '@/lib/LanguageContext'
import Link from 'next/link'

export default function CookieBanner() {
  const { showBanner, acceptAll, openSettings } = useCookies()
  const { t } = useLanguage()

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-lg backdrop-blur-sm bg-opacity-95">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-700 leading-relaxed">
              {t('cookieBannerIntro')}{' '}
              <Link href="/cookies" className="text-gray-900 font-medium hover:underline">
                {t('cookieReadMore')}
              </Link>
            </p>
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={openSettings}
              className="flex-1 sm:flex-none px-5 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              {t('cookieCustomize')}
            </button>
            <button
              onClick={acceptAll}
              className="flex-1 sm:flex-none px-5 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 transition-colors"
            >
              {t('cookieAccept')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
