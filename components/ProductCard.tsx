'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Product } from '@/lib/types'
import { useCart } from '@/lib/CartContext'
import { useFavorites } from '@/lib/FavoritesContext'
import { useLanguage } from '@/lib/LanguageContext'
import { cleanText, colorNameToHex } from '@/lib/utils'
import ShoppingCartIcon from './ShoppingCartIcon'

interface ProductCardProps {
  product: Product
  onInteraction?: () => void
}

export default function ProductCard({ product, onInteraction }: ProductCardProps) {
  const { addToCart } = useCart()
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()
  const { t } = useLanguage()

  const isDisabled = !product.inStock
  
  // Hantera klick på produkten
  const handleProductClick = () => {
    if (onInteraction) {
      onInteraction()
    }
  }

  const getStatusBadge = () => {
    if (!product.inStock) {
      return (
        <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
          {t('outOfStock') || 'Slut i lager'}
        </span>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden hover:shadow transition-all duration-150 hover:border-gray-200">
      {/* Product Image Container */}
      <Link 
        href={`/produkt/${product.id}`}
        className="block relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden group"
        prefetch={true}
        onClick={handleProductClick}
      >
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400 text-xs">{t('image')}</span>
        )}
        {getStatusBadge()}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-150" />
      </Link>
      
      {/* Product Information */}
      <div className="p-2">
        {/* Product Name */}
        <Link 
          href={`/produkt/${product.id}`}
          className="block"
          onClick={handleProductClick}
        >
          <p className="text-gray-900 text-xs font-semibold mb-1 line-clamp-1 leading-tight hover:text-blue-600 transition-colors">
            {cleanText(product.name)}
          </p>
        </Link>
        
        {/* Colors */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-1">
            {product.colors.slice(0, 5).map((color, index) => {
              const hex = colorNameToHex(color)
              return (
                <div
                  key={index}
                  className={`w-3.5 h-3.5 rounded-full border ${hex ? 'border-gray-200' : 'border-gray-300 border-dashed'}`}
                  style={hex ? { backgroundColor: hex } : undefined}
                  title={color}
                />
              )
            })}
            {product.colors.length > 5 && (
              <span className="text-[10px] text-gray-500 leading-none">+{product.colors.length - 5}</span>
            )}
          </div>
        )}



        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-gray-900">
            {product.price} USD
          </span>
          
          <button 
            onClick={() => addToCart(product)}
            disabled={!product.inStock || isDisabled}
            className={`
              flex items-center gap-1 px-1.5 py-0.5 rounded-sm font-medium text-xs transition-all duration-150
              ${!product.inStock || isDisabled
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:scale-95'
              }
            `}
          >
            {product.inStock ? (
              <>
                <ShoppingCartIcon className="w-4 h-4" />
              </>
            ) : (t('outOfStock') || 'Slut i lager')}
          </button>
        </div>
      </div>
    </div>
  )
}
