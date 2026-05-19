'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/lib/types'
import { useCart } from '@/lib/CartContext'
import { useLanguage } from '@/lib/LanguageContext'
import { cleanText, colorNameToHex } from '@/lib/utils'
import ShoppingCartIcon from './ShoppingCartIcon'

interface ProductCardProps {
  product: Product
  onInteraction?: () => void
  priority?: boolean
}

export default function ProductCard({ product, onInteraction, priority = false }: ProductCardProps) {
  const { addToCart } = useCart()
  const { t } = useLanguage()

  const isDisabled = !product.inStock

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden hover:shadow transition-all duration-150 hover:border-gray-200">
      {/* Product Image */}
      <Link
        href={`/produkt/${product.id}`}
        className="block relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden group"
        prefetch={true}
        onClick={onInteraction}
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={cleanText(product.name)}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
            className="object-cover"
            priority={priority}
            loading={priority ? undefined : 'lazy'}
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
            {t('image')}
          </span>
        )}

        {!product.inStock && (
          <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
            {t('outOfStock') || 'Slut i lager'}
          </span>
        )}

        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-150" />
      </Link>

      {/* Product Information */}
      <div className="p-2">
        <Link href={`/produkt/${product.id}`} onClick={onInteraction}>
          <p className="text-gray-900 text-xs font-semibold mb-1 line-clamp-1 leading-tight hover:text-gray-600 transition-colors">
            {cleanText(product.name)}
          </p>
        </Link>

        {/* Color swatches */}
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

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-gray-900">{product.price} USD</span>
          <button
            onClick={() => addToCart(product)}
            disabled={isDisabled}
            className={`flex items-center gap-1 transition-all duration-150 ${
              isDisabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:text-gray-900 active:scale-95'
            }`}
          >
            {product.inStock ? (
              <ShoppingCartIcon className="w-6 h-6 flex-shrink-0" />
            ) : (
              <span className="text-xs">{t('outOfStock') || 'Slut i lager'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}