'use client'

import { useState, useEffect, useRef } from 'react'
import { Product } from '@/lib/types'
import { useLanguage } from '@/lib/LanguageContext'
import { 
  advancedSearch,
  getAutoCompleteSuggestions,
  suggestSpellCorrection,
  SearchOptions 
} from '@/lib/algorithms'

interface SmartSearchProps {
  products: Product[]
  onResults: (results: Product[]) => void
}

export default function SmartSearch({ products, onResults }: SmartSearchProps) {
  const { t } = useLanguage()
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filters, setFilters] = useState<Partial<SearchOptions>>({})
  const [spellingSuggestion, setSpellingSuggestion] = useState<string | null>(null)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [popularSearches, setPopularSearches] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isFocused, setIsFocused] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

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

  // Load categories from database
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories)
        }
      })
      .catch(err => console.error('Error loading categories:', err))
  }, [])

  // Load recent searches
  useEffect(() => {
    const saved = localStorage.getItem('smartSearchRecent')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
        setIsFocused(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Auto-complete
  useEffect(() => {
    if (query.length >= 2) {
      const autoComplete = getAutoCompleteSuggestions(query, products, 8)
      setSuggestions(autoComplete)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(isFocused)
    }
  }, [query, products, isFocused])

  // Save search to recent
  const saveSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return
    
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('smartSearchRecent', JSON.stringify(updated))
  }

  // Sök
  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return
    
    // Stavningskorrigering
    const correction = suggestSpellCorrection(searchQuery, products)
    if (correction && correction !== searchQuery.toLowerCase()) {
      setSpellingSuggestion(correction)
    } else {
      setSpellingSuggestion(null)
    }

    // Utför sökning - visa alla matchande produkter
    const results = advancedSearch(products, {
      query: searchQuery,
      ...filters,
      sortBy: 'relevance'
    })

    onResults(results)
    saveSearch(searchQuery)
    setShowSuggestions(false)
    setIsFocused(false)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    handleSearch(suggestion)
  }

  const handleSpellingClick = () => {
    if (spellingSuggestion) {
      setQuery(spellingSuggestion)
      handleSearch(spellingSuggestion)
    }
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('smartSearchRecent')
  }

  return (
    <div className="relative" ref={searchRef}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true)
              setShowSuggestions(true)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch()
              }
            }}
            placeholder={t('searchProducts')}
            className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
          
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          
          {/* Enhanced Dropdown */}
          {showSuggestions && (
            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-[500px] overflow-y-auto" translate="no">
              {/* Search Suggestions */}
              {suggestions.length > 0 && (
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                    {t('searchSuggestionsTitle')}
                  </h3>
                  <div className="space-y-1">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
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
              {!query && recentSearches.length > 0 && (
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {t('recentSearchesTitle')}
                    </h3>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      {t('clearRecentSearches')}
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(search)}
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
              {!query && popularSearches.length > 0 && (
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                    {t('popularSearchesTitle')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(search)}
                        className="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Categories */}
              {!query && categories.length > 0 && (
                <div className="p-4">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                    {t('categories')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(category)}
                        className="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full"
                        translate="no"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <button
          onClick={() => handleSearch()}
          className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>{t('searchButtonLabel')}</span>
        </button>
      </div>

      {/* Spelling suggestion */}
      {spellingSuggestion && (
        <div className="mt-2 text-sm text-gray-600">
          {t('didYouMeanPrefix')}{' '}
          <button
            onClick={handleSpellingClick}
            className="text-gray-900 underline hover:text-gray-700"
          >
            {spellingSuggestion}
          </button>
          ?
        </div>
      )}
    </div>
  )
}
