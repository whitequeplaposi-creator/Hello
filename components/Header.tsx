'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useCart } from '@/lib/CartContext'
import { useAuth } from '@/lib/AuthContext'
import { useLanguage } from '@/lib/LanguageContext'
import { useCategory } from '@/lib/CategoryContext'
import { useSearch } from '@/lib/SearchContext'
import Cart from './Cart'
import GlobeIcon from './GlobeIcon'
import ShoppingCartIcon from './ShoppingCartIcon'
import TruckIcon from './TruckIcon'
import UserIcon from './UserIcon'
import SwedishFlag from './SwedishFlag'
import { EnglishFlag } from '@/flagg'
import BrandmarkLogo from './BrandmarkLogo'

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [popularSearches, setPopularSearches] = useState<string[]>([])
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const languageDropdownRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const { totalItems } = useCart()
  const { user, logout, isLoading } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const { selectedCategory, setSelectedCategory } = useCategory()
  const { searchQuery, setSearchQuery } = useSearch()
  
  // Load categories from database
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.categories && data.categories.length > 0) {
          setCategories(['All', ...data.categories])
        }
      })
      .catch(err => console.error('Error loading categories:', err))
  }, [])
  
  // Load popular searches from database
  useEffect(() => {
    fetch('/api/search/popular')
      .then(res => res.json())
      .then(data => {
        if (data.popularSearches && data.popularSearches.length > 0) {
          setPopularSearches(data.popularSearches.slice(0, 5))
        }
      })
      .catch(err => console.error('Error loading popular searches:', err))
  }, [])
  
  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])
  
  // Close language dropdown and search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setIsLanguageDropdownOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
  // Generate search suggestions based on query with debouncing
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    if (searchQuery.length >= 2) {
      debounceTimerRef.current = setTimeout(() => {
        const query = searchQuery.toLowerCase().trim()
        
        // Filter categories that match the query
        const categorySuggestions = categories
          .filter(c => c.toLowerCase().includes(query))
          .slice(0, 4)
        
        // Filter popular searches that match the query
        const popularSuggestions = popularSearches
          .filter(s => s.toLowerCase().includes(query))
          .slice(0, 4)
        
        // Combine and deduplicate
        const combined = [...new Set([...categorySuggestions, ...popularSuggestions])].slice(0, 6)
        setSearchSuggestions(combined)
      }, 150) // 150ms debounce
    } else {
      setSearchSuggestions([])
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [searchQuery, categories, popularSearches])
  
  // Save search to recent searches
  const saveSearch = (query: string) => {
    if (!query.trim()) return
    
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }
  
  // Handle search submission
  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query)
    saveSearch(query)
    setIsSearchFocused(false)
    setIsSearchOpen(false)
  }
  
  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }
  
  // Prevent body scroll when menu or search is open
  useEffect(() => {
    if (isMenuOpen || isSearchOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen, isSearchOpen])

  const handleLanguageChange = (lang: 'sv' | 'en') => {
    setLanguage(lang)
  }

  return (
    <>
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        {/* Mobile Header */}
        <div className="lg:hidden">
          <div className="container mx-auto px-3 py-3">
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-800 p-2 -ml-2 touch-manipulation"
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
              
              <BrandmarkLogo size="sm" showText={true} variant="default" className="flex-shrink-0" />
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="text-gray-600 hover:text-gray-800 p-2 touch-manipulation"
                  aria-label={t('search')}
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
                
                {!isLoading && user && (
                  <Link
                    href="/mina-sidor"
                    className="text-gray-600 hover:text-gray-800 p-2 touch-manipulation"
                    aria-label={t('myPagesTitle')}
                  >
                    <UserIcon className="h-6 w-6" />
                  </Link>
                )}
                
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="text-gray-600 hover:text-gray-800 relative p-2 -mr-2 touch-manipulation"
                  aria-label={t('cart')}
                >
                  <ShoppingCartIcon className="h-6 w-6" />
                  {totalItems > 0 && (
                    <span className="absolute top-0 right-0 bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block">
          {/* Top Bar */}
          <div className="bg-black relative z-10">
            <div className="container mx-auto px-6">
              <div className="flex items-center justify-between h-10">
                <div className="flex items-center gap-6 text-xs text-gray-300">
                  <div className="flex items-center gap-1.5">
                    <TruckIcon className="w-4 h-4 text-gray-300" />
                    <span>{t('deliveryDay')}</span>
                  </div>
                </div>
                
                <nav className="flex items-center gap-6 text-xs relative z-10">
                  <div className="relative" ref={languageDropdownRef}>
                    <button
                      onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                      className="text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      <GlobeIcon className="w-4 h-4" />
                      <span>{language === 'sv' ? t('swedish') : t('english')}</span>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {isLanguageDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-md shadow-lg border border-gray-100 z-[70]">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              handleLanguageChange('sv')
                              setIsLanguageDropdownOpen(false)
                            }}
                            className={`flex items-center gap-2.5 w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${language === 'sv' ? 'text-gray-900' : 'text-gray-600'}`}
                          >
                            <SwedishFlag className="w-4 h-4" />
                            <span>{t('swedish')}</span>
                            {language === 'sv' && (
                              <svg className="w-4 h-4 ml-auto text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              handleLanguageChange('en')
                              setIsLanguageDropdownOpen(false)
                            }}
                            className={`flex items-center gap-2.5 w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${language === 'en' ? 'text-gray-900' : 'text-gray-600'}`}
                          >
                            <EnglishFlag className="w-4 h-4" />
                            <span>{t('english')}</span>
                            {language === 'en' && (
                              <svg className="w-4 h-4 ml-auto text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {!isLoading ? (
                    user ? (
                      <>
                        <Link
                          href="/mina-sidor"
                          className="text-gray-300 hover:text-white transition-colors relative z-10"
                        >
                          {t('hello')}, {user.name}
                        </Link>
                        <button
                          onClick={logout}
                          className="text-gray-300 hover:text-white transition-colors relative z-10"
                        >
                          {t('logout')}
                        </button>
                      </>
                    ) : (
                      <Link href="/login" className="text-gray-300 hover:text-white transition-colors relative z-10">
                        {t('login')}
                      </Link>
                    )
                  ) : null}
                </nav>
              </div>
            </div>
          </div>
          
          {/* Main Header */}
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-8">
                <BrandmarkLogo size="md" showText={true} variant="default" />
                
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-700 hover:text-gray-900 flex items-center gap-2 text-sm transition-colors"
                  aria-label={t('menu')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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
                  <span>{t('categories')}</span>
                </button>
              </div>
              
              <div className="flex-1 max-w-2xl mx-8">
                <div className="relative" ref={searchRef}>
                  <div className="relative">
                    <input
                      type="search"
                      placeholder={t('search')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && searchQuery.trim()) {
                          handleSearchSubmit(searchQuery)
                        }
                      }}
                      className="w-full px-4 py-2.5 pr-12 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-sm"
                    />
                    <button
                      onClick={() => searchQuery.trim() && handleSearchSubmit(searchQuery)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700"
                      aria-label={t('search')}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <nav className="flex items-center gap-6">
                {!isLoading && user && (
                  <Link
                    href="/mina-sidor"
                    className="text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors"
                    title={t('myPagesTitle')}
                  >
                    <UserIcon className="h-5 w-5" />
                  </Link>
                )}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="text-gray-600 hover:text-gray-900 relative transition-colors"
                >
                  <ShoppingCartIcon className="h-7 w-7" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Search Dropdown - Rendered outside header to prevent layout issues */}
      {isSearchFocused && (
        <div 
          className="fixed left-0 right-0 z-[60] hidden lg:block"
          style={{ top: 'calc(2.5rem + 4rem)' }} // Position below top bar (2.5rem) + main header (4rem)
        >
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8" style={{ width: 'calc(100% - 48rem)' }}>
                {/* Spacer for logo and menu button */}
              </div>
              
              <div className="flex-1 max-w-2xl mx-8">
                <div className="bg-white border border-gray-200 rounded-lg shadow-xl max-h-[500px] overflow-y-auto mt-2">
                  {/* Search Suggestions */}
                  {searchSuggestions.length > 0 && (
                    <div className="p-4 border-b border-gray-100">
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                        Sökförslag
                      </h3>
                      <div className="space-y-1">
                        {searchSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSearchSubmit(suggestion)}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2"
                          >
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span>{suggestion}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Recent Searches */}
                  {!searchQuery && recentSearches.length > 0 && (
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Senaste sökningar
                        </h3>
                        <button
                          onClick={clearRecentSearches}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          Rensa
                        </button>
                      </div>
                      <div className="space-y-1">
                        {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => handleSearchSubmit(search)}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2"
                          >
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{search}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Popular Searches */}
                  {!searchQuery && popularSearches.length > 0 && (
                    <div className="p-4">
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                        Popular searches
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {popularSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => handleSearchSubmit(search)}
                            className="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Categories Quick Access */}
                  {!searchQuery && categories.length > 1 && (
                    <div className="p-4 border-t border-gray-100">
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                        Categories
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.filter(c => c !== 'All').slice(0, 6).map((category) => (
                          <button
                            key={category}
                            onClick={() => {
                              setSearchQuery(category)
                              setSelectedCategory(category)
                              setIsSearchFocused(false)
                            }}
                            className="px-3 py-2 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded text-left"
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <nav className="flex items-center gap-6">
                {/* Spacer for user icon and cart */}
                <div style={{ width: '7rem' }}></div>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      
      {/* Mobile Dropdown Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-[85vw] max-w-sm bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Menu Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gray-50 sticky top-0 z-10">
            <h2 className="text-lg text-gray-800">{t('menu')}</h2>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-600 hover:text-gray-800 p-2 -mr-2 touch-manipulation"
              aria-label={t('closeMenu')}
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
          
          {/* Menu Content */}
          <div className="flex-1 overflow-y-auto">
            {/* User Section */}
            {!isLoading ? (
              user ? (
                <div className="p-4 bg-blue-50 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 border-b">
                  <p className="text-sm text-gray-600 mb-3">{t('loginPrompt')}</p>
                  <div className="flex gap-2">
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex-1 bg-gray-900 text-white text-center py-2.5 px-4 rounded-lg hover:bg-gray-700 text-sm touch-manipulation"
                    >
                      {t('login')}
                    </Link>
                    <Link
                      href="/registrera"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex-1 border border-gray-300 text-gray-700 text-center py-2.5 px-4 rounded-lg hover:bg-gray-50 text-sm touch-manipulation"
                    >
                      {t('register')}
                    </Link>
                  </div>
                </div>
              )
            ) : null}
            
            {/* Quick Links */}
            <nav className="p-4 border-b">
              <label className="text-xs text-gray-500 uppercase tracking-wide mb-3 block">
                {t('quickLinks')}
              </label>
              <div className="space-y-1">
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 py-3 px-3 rounded-lg touch-manipulation"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>{t('home')}</span>
                </Link>
                <Link
                  href="/varukorg"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 py-3 px-3 rounded-lg touch-manipulation"
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  <span>{t('cart')}</span>
                  {totalItems > 0 && (
                    <span className="ml-auto bg-gray-900 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </div>
            </nav>
            
            {/* Categories */}
            <div className="p-4 border-b">
              <label className="text-xs text-gray-500 uppercase tracking-wide mb-3 block">
                {t('categories')}
              </label>
              <div className="space-y-1">
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
                    className={`w-full text-left py-3 px-3 rounded-lg touch-manipulation ${
                      selectedCategory === category
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Delivery Info */}
            <div className="p-4 border-b">
              <div className="flex items-center gap-3 text-gray-700 bg-green-50 p-3 rounded-lg">
                <TruckIcon className="w-6 h-6 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm">{t('deliveryDay')}</p>
                  <p className="text-xs text-gray-600">{t('shippingFreeOverShort')}</p>
                </div>
              </div>
            </div>
            
            {/* Language Selector */}
            <div className="p-4 border-b">
              <label className="text-xs text-gray-500 uppercase tracking-wide mb-3 block">
                {t('language')}
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    handleLanguageChange('sv')
                  }}
                  className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg touch-manipulation ${
                    language === 'sv' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <SwedishFlag className="w-6 h-6" />
                  <div className="text-left">
                    <div>{t('swedish')}</div>
                    <div className="text-xs text-gray-500">{t('swedishSecondary')}</div>
                  </div>
                  {language === 'sv' && (
                    <svg className="w-5 h-5 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => {
                    handleLanguageChange('en')
                  }}
                  className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg touch-manipulation ${
                    language === 'en' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <EnglishFlag className="w-6 h-6" />
                  <div className="text-left">
                    <div>{t('english')}</div>
                    <div className="text-xs text-gray-500">{t('englishSecondary')}</div>
                  </div>
                  {language === 'en' && (
                    <svg className="w-5 h-5 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            {/* Additional Links */}
            <div className="p-4">
              <label className="text-xs text-gray-500 uppercase tracking-wide mb-3 block">
                {t('information')}
              </label>
              <div className="space-y-1">
                <Link
                  href="/om-oss"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-gray-700 hover:text-blue-600 hover:bg-gray-50 py-3 px-3 rounded-lg touch-manipulation"
                >
                  {t('aboutUs')}
                </Link>
                <Link
                  href="/kontakt"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-gray-700 hover:text-blue-600 hover:bg-gray-50 py-3 px-3 rounded-lg touch-manipulation"
                >
                  {t('contactUs')}
                </Link>
                <Link
                  href="/frakt-leverans"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-gray-700 hover:text-blue-600 hover:bg-gray-50 py-3 px-3 rounded-lg touch-manipulation"
                >
                  {t('shippingDelivery')}
                </Link>
                <Link
                  href="/returer"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-gray-700 hover:text-blue-600 hover:bg-gray-50 py-3 px-3 rounded-lg touch-manipulation"
                >
                  {t('returnsExchanges')}
                </Link>
                <Link
                  href="/faq"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-gray-700 hover:text-blue-600 hover:bg-gray-50 py-3 px-3 rounded-lg touch-manipulation"
                >
                  {t('faq')}
                </Link>
              </div>
            </div>
          </div>
          
          {/* Menu Footer */}
          {user && (
            <div className="p-4 border-t bg-gray-50">
              <button
                onClick={() => {
                  logout()
                  setIsMenuOpen(false)
                }}
                className="w-full text-center text-red-600 hover:text-red-700 py-3 px-4 rounded-lg hover:bg-red-50 touch-manipulation"
              >
                {t('logout')}
              </button>
            </div>
          )}
        </div>
      </div>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      {/* Mobile Search Modal */}
      {isSearchOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSearchOpen(false)}
          />
          <div className="fixed inset-0 bg-white z-50 lg:hidden flex flex-col">
            {/* Search Header */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-200">
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-gray-600 hover:text-gray-800 p-2 -ml-2 touch-manipulation"
                aria-label={t('closeSearchAria')}
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
              
              <div className="flex-1 relative">
                <input
                  type="search"
                  placeholder={t('search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      handleSearchSubmit(searchQuery)
                    }
                  }}
                  autoFocus
                  className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-base touch-manipulation"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            
            {/* Search Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Search Suggestions */}
              {searchSuggestions.length > 0 && (
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                    {t('searchSuggestionsTitle')}
                  </h3>
                  <div className="space-y-1">
                    {searchSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearchSubmit(suggestion)}
                        className="w-full text-left px-3 py-3 text-base text-gray-700 hover:bg-gray-50 rounded flex items-center gap-3 touch-manipulation"
                      >
                        <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span className="flex-1">{suggestion}</span>
                        <svg className="w-5 h-5 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Recent Searches */}
              {!searchQuery && recentSearches.length > 0 && (
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {t('recentSearchesTitle')}
                    </h3>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-gray-500 hover:text-gray-700 touch-manipulation px-2 py-1"
                    >
                      {t('clearRecentSearches')}
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearchSubmit(search)}
                        className="w-full text-left px-3 py-3 text-base text-gray-700 hover:bg-gray-50 rounded flex items-center gap-3 touch-manipulation"
                      >
                        <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="flex-1">{search}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Popular Searches */}
              {!searchQuery && popularSearches.length > 0 && (
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                    {t('popularSearchesTitle')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearchSubmit(search)}
                        className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full touch-manipulation"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Categories */}
              {!searchQuery && categories.length > 1 && (
                <div className="p-4">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                    {t('categories')}
                  </h3>
                  <div className="space-y-2">
                    {categories.filter(c => c !== 'All').map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSearchQuery(category)
                          setSelectedCategory(category)
                          setIsSearchOpen(false)
                        }}
                        className="w-full text-left px-4 py-3 text-base text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg touch-manipulation"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
