'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useCart } from '@/lib/CartContext'
import { useAuth } from '@/lib/AuthContext'
import { useLanguage } from '@/lib/LanguageContext'
import { useCategory } from '@/lib/CategoryContext'
import { useSearch } from '@/lib/SearchContext'
import { products } from '@/lib/data'
import Cart from './Cart'
import GlobeIcon from './GlobeIcon'
import ShoppingCartIcon from './ShoppingCartIcon'
import TruckIcon from './TruckIcon'
import UserIcon from './UserIcon'
import SwedishFlag from './SwedishFlag'
import { EnglishFlag } from '@/flagg'

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const languageDropdownRef = useRef<HTMLDivElement>(null)
  const { totalItems } = useCart()
  const { user, logout } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const { selectedCategory, setSelectedCategory } = useCategory()
  const { searchQuery, setSearchQuery } = useSearch()
  
  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setIsLanguageDropdownOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))]

  const handleLanguageChange = (lang: 'sv' | 'en') => {
    setLanguage(lang)
  }

  return (
    <>
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-800 p-2"
                aria-label={t('menu')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <Link href="/" className="text-2xl font-bold text-gray-800">
                {t('ecommerce')}
              </Link>
            </div>
            
            <div className="flex-1 max-w-xl mx-4 lg:mx-8 hidden md:block">
              <div className="relative">
                <input
                  type="search"
                  placeholder={t('search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-600 hover:text-gray-800"
                  aria-label={t('imageSearch')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <nav className="flex items-center gap-3 sm:gap-6">
              <button
                onClick={() => setIsCartOpen(true)}
                className="text-gray-600 hover:text-gray-800 relative"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
              {user && (
                <Link
                  href="/mina-sidor"
                  className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
                  title="Mina sidor"
                >
                  <UserIcon className="h-6 w-6" />
                  <span className="hidden lg:inline text-sm">Mina sidor</span>
                </Link>
              )}
              <div className="hidden sm:flex items-center gap-2 px-2 py-1">
                <TruckIcon className="w-5 h-5" />
                <span className="text-sm">{t('deliveryDay')}</span>
              </div>
              <div className="relative" ref={languageDropdownRef}>
                <button
                  onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                  className="text-gray-600 hover:text-gray-800 flex items-center gap-2 px-2 py-1"
                >
                  <GlobeIcon className="w-5 h-5" />
                </button>
                
                {isLanguageDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-2">
                      <button
                        onClick={() => {
                          handleLanguageChange('sv')
                          setIsLanguageDropdownOpen(false)
                        }}
                        className={`flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 ${language === 'sv' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                      >
                        <SwedishFlag className="w-5 h-5" />
                        <div>
                          <div className="font-medium">Svenska</div>
                          <div className="text-xs text-gray-500">SV</div>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          handleLanguageChange('en')
                          setIsLanguageDropdownOpen(false)
                        }}
                        className={`flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 ${language === 'en' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                      >
                        <EnglishFlag className="w-5 h-5" />
                        <div>
                          <div className="font-medium">English</div>
                          <div className="text-xs text-gray-500">EN</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">{t('hello')}, {user.name}</span>
                  <button
                    onClick={logout}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    {t('logout')}
                  </button>
                </div>
              ) : (
                <Link href="/login" className="text-gray-600 hover:text-gray-800">
                  {t('login')}
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 overflow-y-auto ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">{t('menu')}</h2>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          
          {/* Mobile Search */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="search"
                placeholder={t('search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-600 hover:text-gray-800"
                aria-label={t('imageSearch')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
          
          <nav className="flex flex-col gap-4">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-700 hover:text-blue-600 py-2 px-4 rounded hover:bg-gray-100"
            >
              {t('products')}
            </Link>
            
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-500 px-4 mb-2">{t('categories')}</h3>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    if (category === 'All') {
                      setSearchQuery('')
                    } else {
                      setSearchQuery(category)
                    }
                    setSelectedCategory(category)
                    setIsMenuOpen(false)
                  }}
                  className={`w-full text-left py-2 px-4 rounded hover:bg-gray-100 ${
                    selectedCategory === category
                      ? 'text-blue-600 font-medium bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            <div className="border-t pt-4">
              {user ? (
                <>
                  <div className="text-gray-600 py-2 px-4">
                    {t('hello')}, {user.name}
                  </div>
                  <Link
                    href="/mina-sidor"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 py-2 px-4 rounded hover:bg-gray-100"
                  >
                    <UserIcon className="h-6 w-6" />
                    <span>Mina sidor</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setIsMenuOpen(false)
                    }}
                    className="w-full text-left text-gray-700 hover:text-blue-600 py-2 px-4 rounded hover:bg-gray-100"
                  >
                    {t('logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-gray-700 hover:text-blue-600 py-2 px-4 rounded hover:bg-gray-100"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    href="/registrera"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-gray-700 hover:text-blue-600 py-2 px-4 rounded hover:bg-gray-100"
                  >
                    {t('register')}
                  </Link>
                </>
              )}
              <Link
                href="/varukorg"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 py-2 px-4 rounded hover:bg-gray-100"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                <span>{t('cart')}</span>
              </Link>
            </div>
          </nav>
        </div>
      </div>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
