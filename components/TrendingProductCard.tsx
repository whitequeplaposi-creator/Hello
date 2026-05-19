'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/lib/types'
import { useCart } from '@/lib/CartContext'
import { cleanText } from '@/lib/utils'
import ShoppingCartIcon from './ShoppingCartIcon'

interface TrendingProductCardProps {
  product: Product
  onInteraction?: () => void
}

export default function TrendingProductCard({ product, onInteraction }: TrendingProductCardProps) {
  const { addToCart } = useCart()

  // Deterministic discount for visual appeal
  const seed = product.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const discounts = [15, 20, 25, 30, 35, 40, 45, 50]
  const discount = discounts[seed % discounts.length]
  const originalPrice = Math.round(product.price * (1 + discount / 100))

  return (
    <div className="group relative bg-white overflow-hidden">
      {/* 3:4 portrait image */}
      <Link
        href={`/produkt/${product.id}`}
        className="block relative aspect-[3/4] bg-gray-50 overflow-hidden"
        prefetch={true}
        onClick={onInteraction}
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={cleanText(product.name)}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-gray-300">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </span>
        )}

        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded">Slut i lager</span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="pt-1.5 pb-2 px-0.5">
        <Link href={`/produkt/${product.id}`} onClick={onInteraction}>
          <p className="text-[11px] text-gray-700 line-clamp-2 leading-tight mb-1 hover:text-black transition-colors">
            {cleanText(product.name)}
          </p>
        </Link>

        <div className="flex items-center justify-between gap-1">
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-black">${product.price}</span>
            <span className="text-[10px] text-gray-400 line-through">${originalPrice}</span>
          </div>

          {product.inStock && (
            <button
              onClick={(e) => {
                e.preventDefault()
                addToCart(product)
              }}
              className="flex items-center justify-center w-6 h-6 flex-shrink-0 text-gray-500 hover:text-black transition-colors"
              aria-label="Lägg i kundvagn"
            >
              <ShoppingCartIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
