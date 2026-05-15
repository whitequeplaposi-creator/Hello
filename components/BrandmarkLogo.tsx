'use client'

import Link from 'next/link'

interface BrandmarkLogoProps {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'minimal' | 'full'
}

export default function BrandmarkLogo({ 
  className = '', 
  showText = true,
  size = 'md',
  variant = 'default'
}: BrandmarkLogoProps) {
  const sizeClasses = {
    sm: { text: 'text-lg', container: 'h-8' },
    md: { text: 'text-2xl', container: 'h-12' },
    lg: { text: 'text-3xl', container: 'h-16' },
    xl: { text: 'text-4xl', container: 'h-20' }
  }

  const currentSize = sizeClasses[size]

  return (
    <Link 
      href="/" 
      className={`inline-flex items-center group ${className}`}
      aria-label="Boxshe - Hem"
    >
      {/* Brand Name with Raleway Typography - Matching Brandmark Design */}
      {showText && (
        <div className={`flex items-center ${currentSize.container}`}>
          <span 
            className={`font-medium tracking-tight ${currentSize.text} leading-none transition-all duration-300 group-hover:opacity-80`}
            style={{ 
              fontFamily: 'Raleway, -apple-system, BlinkMacSystemFont, sans-serif', 
              fontWeight: 500,
              color: '#0f083e',
              letterSpacing: '0em'
            }}
          >
            BOXSHE
          </span>
          {variant === 'full' && (
            <span 
              className="text-xs tracking-widest ml-3 transition-all duration-300 group-hover:opacity-70"
              style={{ 
                fontFamily: 'Raleway, sans-serif',
                color: '#0f083e',
                opacity: 0.6,
                letterSpacing: '0.2em',
                fontWeight: 400
              }}
            >
              FASHION
            </span>
          )}
        </div>
      )}
    </Link>
  )
}
