'use client'

import Link from 'next/link'
import { useState } from 'react'
import VisaIcon from './VisaIcon'
import MastercardIcon from './MastercardIcon'
import PaypalIcon from './PaypalIcon'
import FacebookIcon from './FacebookIcon'
import TwitterIcon from './TwitterIcon'
import InstagramIcon from './InstagramIcon'
import YouTubeIcon from './YouTubeIcon'

interface FooterCategory {
  title: string
  links: { href: string; text: string }[]
}

const footerCategories: FooterCategory[] = [
  {
    title: 'Om oss',
    links: [
      { href: '/om-oss', text: 'Om oss' },
      { href: '/hallbarhet', text: 'Hållbarhet' }
    ]
  },
  {
    title: 'Kundservice',
    links: [
      { href: '/kontakt', text: 'Kontakta oss' },
      { href: '/frakt-leverans', text: 'Frakt & Leverans' },
      { href: '/returer', text: 'Returer & Byten' },
      { href: '/faq', text: 'Vanliga frågor' }
    ]
  },
  {
    title: 'Villkor',
    links: [
      { href: '/kopvillkor', text: 'Köpvillkor' },
      { href: '/integritet', text: 'Integritetspolicy' },
      { href: '/cookies', text: 'Cookies' },
      { href: '/angerratt', text: 'Ångerrätt' }
    ]
  }
]

export default function Footer() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  const toggleCategory = (categoryTitle: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryTitle)
        ? prev.filter(title => title !== categoryTitle)
        : [...prev, categoryTitle]
    )
  }
  return (
    <footer className="bg-white text-gray-800 mt-12 border-t border-gray-200">
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
                <ul className="pt-2 pb-4 space-y-2 text-gray-600">
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
            <h3 className="font-bold mb-4 text-gray-800">Följ oss</h3>
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
        </div>

        {/* Desktop Grid View */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="text-center sm:text-left">
            <h3 className="font-bold mb-4">Om oss</h3>
            <ul className="space-y-2 text-gray-600">
              <li><Link href="/om-oss" className="hover:text-gray-900">Om oss</Link></li>
              <li><Link href="/hallbarhet" className="hover:text-gray-900">Hållbarhet</Link></li>
            </ul>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-bold mb-4">Kundservice</h3>
            <ul className="space-y-2 text-gray-600">
              <li><Link href="/kontakt" className="hover:text-gray-900">Kontakta oss</Link></li>
              <li><Link href="/frakt-leverans" className="hover:text-gray-900">Frakt & Leverans</Link></li>
              <li><Link href="/returer" className="hover:text-gray-900">Returer & Byten</Link></li>
              <li><Link href="/faq" className="hover:text-gray-900">Vanliga frågor</Link></li>
            </ul>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-bold mb-4">Villkor</h3>
            <ul className="space-y-2 text-gray-600">
              <li><Link href="/kopvillkor" className="hover:text-gray-900">Köpvillkor</Link></li>
              <li><Link href="/integritet" className="hover:text-gray-900">Integritetspolicy</Link></li>
              <li><Link href="/cookies" className="hover:text-gray-900">Cookies</Link></li>
              <li><Link href="/angerratt" className="hover:text-gray-900">Ångerrätt</Link></li>
            </ul>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-bold mb-4">Leveransmetoder</h3>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-bold mb-4">Följ oss</h3>
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
            <div className="order-2 lg:order-1">
              <p className="text-gray-600 text-sm">&copy; {new Date().getFullYear()} E-handel. Alla rättigheter förbehållna.</p>
            </div>
            <div className="order-1 lg:order-2 flex flex-col items-center gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 text-sm mr-2">Leverans:</span>
                  <div className="flex gap-1">
                    <img src="/db-schenker-logo.png" alt="DB Schenker Leverans" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
                    <img src="/dhl-brand.svg" alt="DHL Leverans" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
                    <img src="/postnord-logo.png" alt="PostNord Leverans" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 text-sm mr-2">Betalmetoder:</span>
                  <div className="flex gap-2">
                    <VisaIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                    <MastercardIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                    <PaypalIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
