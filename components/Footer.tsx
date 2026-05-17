'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import FacebookIcon from './FacebookIcon'
import TwitterIcon from './TwitterIcon'
import InstagramIcon from './InstagramIcon'
import YouTubeIcon from './YouTubeIcon'
import BrandmarkLogo from './BrandmarkLogo'

export default function Footer() {
  const { t } = useLanguage()
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  const footerCategories = [
    {
      title: t('aboutUs'),
      links: [
        { href: '/om-oss', text: t('aboutUs') },
        { href: '/hallbarhet', text: t('sustainability') }
      ]
    },
    {
      title: t('customerService'),
      links: [
        { href: '/kontakt', text: t('contactUs') },
        { href: '/frakt-leverans', text: t('shippingDelivery') },
        { href: '/returer', text: t('returnsExchanges') },
        { href: '/faq', text: t('faq') }
      ]
    },
    {
      title: t('terms'),
      links: [
        { href: '/kopvillkor', text: t('termsOfPurchase') },
        { href: '/integritet', text: t('privacyPolicy') },
        { href: '/cookies', text: t('cookies') },
        { href: '/angerratt', text: t('rightOfWithdrawal') }
      ]
    }
  ]

  const toggleCategory = (categoryTitle: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryTitle)
        ? prev.filter(title => title !== categoryTitle)
        : [...prev, categoryTitle]
    )
  }
  return (
    <footer className="bg-white text-gray-800 mt-12 border-t border-gray-200" style={{ fontFamily: 'var(--font-oswald), sans-serif', fontWeight: 400 }}>
      <div className="container mx-auto px-4 py-8">
        {/* Mobile Accordion View */}
        <div className="sm:hidden">
          {footerCategories.map((category) => (
            <div key={category.title} className="mb-6">
              <button
                onClick={() => toggleCategory(category.title)}
                className="w-full flex items-center justify-between py-3 text-left font-bold text-gray-800 hover:text-gray-600 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl text-gray-600">›</span>
                  <span>{category.title}</span>
                </div>
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${
                    expandedCategories.includes(category.title) ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  expandedCategories.includes(category.title) ? 'max-h-48' : 'max-h-0'
                }`}
              >
                <ul className="pt-2 pb-4 space-y-2 text-gray-600 font-bold text-sm">
                  {category.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="block py-2 hover:text-gray-900 transition-colors"
                      >
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          
          {/* Mobile Social Icons */}
          <div className="mb-6">
            <h3 className="font-normal mb-4 text-gray-800">{t('followUs')}</h3>
            <div className="flex gap-4 justify-center">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <FacebookIcon className="w-6 h-6" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <InstagramIcon className="w-6 h-6" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <TwitterIcon className="w-6 h-6" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <YouTubeIcon className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Mobile Payment Icons */}
          <div className="mb-6">
            <h3 className="font-normal mb-4 text-gray-800">{t('paymentMethods')}</h3>
            <div className="flex gap-2 justify-center flex-wrap">
              <img src="/visa.svg" alt="Visa" className="h-8 w-auto" />
              <img src="/mastercard.svg" alt="Mastercard" className="h-8 w-auto" />
            </div>
          </div>
        </div>

        {/* Desktop Grid View */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-6 gap-8">
          <div className="text-center sm:text-left">
            <h3 className="font-bold mb-4">{t('aboutUs')}</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><Link href="/om-oss" className="hover:text-gray-900">{t('aboutUs')}</Link></li>
              <li><Link href="/hallbarhet" className="hover:text-gray-900">{t('sustainability')}</Link></li>
            </ul>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-bold mb-4">{t('customerService')}</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><Link href="/kontakt" className="hover:text-gray-900">{t('contactUs')}</Link></li>
              <li><Link href="/frakt-leverans" className="hover:text-gray-900">{t('shippingDelivery')}</Link></li>
              <li><Link href="/returer" className="hover:text-gray-900">{t('returnsExchanges')}</Link></li>
              <li><Link href="/faq" className="hover:text-gray-900">{t('faq')}</Link></li>
            </ul>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-bold mb-4">{t('terms')}</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><Link href="/kopvillkor" className="hover:text-gray-900">{t('termsOfPurchase')}</Link></li>
              <li><Link href="/integritet" className="hover:text-gray-900">{t('privacyPolicy')}</Link></li>
              <li><Link href="/cookies" className="hover:text-gray-900">{t('cookies')}</Link></li>
              <li><Link href="/angerratt" className="hover:text-gray-900">{t('rightOfWithdrawal')}</Link></li>
            </ul>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-normal mb-4">{t('paymentMethods')}</h3>
            <div className="flex gap-2 justify-center sm:justify-start flex-wrap">
              <img src="/visa.svg" alt="Visa" className="h-8 w-auto" />
              <img src="/mastercard.svg" alt="Mastercard" className="h-8 w-auto" />
            </div>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-normal mb-4">{t('deliveryMethods')}</h3>
            <div className="flex gap-2 justify-center sm:justify-start">
              <img src="/db-schenker-logo.png" alt="DB Schenker" className="w-12 h-12 object-contain" />
              <img src="/dhl-brand.svg" alt="DHL" className="w-12 h-12 object-contain" />
              <img src="/postnord-logo.png" alt="PostNord" className="w-12 h-12 object-contain" />
            </div>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-normal mb-4">{t('followUs')}</h3>
            <div className="flex gap-4 justify-center sm:justify-start">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <FacebookIcon className="w-6 h-6" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <InstagramIcon className="w-6 h-6" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <TwitterIcon className="w-6 h-6" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <YouTubeIcon className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex flex-col items-center gap-6 text-center lg:text-left lg:flex-row lg:justify-between">
            <div className="order-1 lg:order-1">
              <BrandmarkLogo size="sm" showText={true} variant="default" className="justify-center lg:justify-start" />
            </div>
            <div className="order-2 lg:order-2">
              <p className="text-gray-600 text-sm">&copy; {new Date().getFullYear()} Boxshe. {t('allRightsReserved')}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
