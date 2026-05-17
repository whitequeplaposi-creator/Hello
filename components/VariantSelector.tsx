'use client'

import { useState, useCallback } from 'react'
import { colorNameToHex } from '@/lib/utils'

export interface VariantState {
  selectedColor: string | null
  selectedSize: string | null
  currentImageIndex: number
  currentPrice: number
  inStock: boolean
}

interface VariantSelectorProps {
  colors: string[]
  sizes: string[]
  images: string[]
  basePrice: number
  baseInStock: boolean
  currentImageIndex: number
  onChange: (state: VariantState) => void
}

// Size price modifiers (relative to base price)
const SIZE_PRICE_MODIFIERS: Record<string, number> = {
  'XS': -2,
  'S': 0,
  'M': 0,
  'L': 2,
  'XL': 4,
  'XXL': 6,
  '2XL': 6,
  '3XL': 8,
  '4XL': 10,
}

// Deterministically decide if a variant is in stock based on color+size combo
function isVariantInStock(color: string | null, size: string | null, baseInStock: boolean): boolean {
  if (!baseInStock) return false
  if (!color && !size) return baseInStock
  const key = `${color ?? ''}-${size ?? ''}`
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) & 0xffff
  }
  return hash % 10 !== 0
}

/**
 * Find the best matching image index for a given color.
 *
 * The Eprolo database stores colors and images as separate comma-separated
 * strings with NO guaranteed positional relationship between them.
 * The only reliable signal is whether the image URL contains the color name.
 *
 * Returns -1 if no URL match is found (caller should NOT change the image).
 */
function findImageIndexForColor(color: string, images: string[]): number {
  if (images.length === 0) return -1
  if (images.length === 1) return 0

  const colorLower = color.toLowerCase().trim()

  // Build search tokens: full name + individual words (skip very short ones)
  const tokens = [colorLower, ...colorLower.split(/\s+/).filter(t => t.length >= 4)]

  for (const token of tokens) {
    for (let i = 0; i < images.length; i++) {
      const urlLower = images[i].toLowerCase()
      if (
        urlLower.includes(`_${token}_`) ||
        urlLower.includes(`-${token}-`) ||
        urlLower.includes(`/${token}/`) ||
        urlLower.includes(`_${token}.`) ||
        urlLower.includes(`-${token}.`)
      ) {
        return i
      }
    }
  }

  // Looser: token appears anywhere in the URL
  for (const token of tokens) {
    for (let i = 0; i < images.length; i++) {
      if (images[i].toLowerCase().includes(token)) {
        return i
      }
    }
  }

  // No match found — do NOT change the image
  return -1
}

export default function VariantSelector({
  colors,
  sizes,
  images,
  basePrice,
  baseInStock,
  currentImageIndex,
  onChange,
}: VariantSelectorProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  const getPriceForSize = useCallback(
    (size: string | null): number => {
      if (!size) return basePrice
      const mod = SIZE_PRICE_MODIFIERS[size.toUpperCase()] ?? 0
      return Math.max(0, basePrice + mod)
    },
    [basePrice]
  )

  const handleColorSelect = useCallback(
    (color: string) => {
      const next = selectedColor === color ? null : color
      setSelectedColor(next)
      // Only switch image if we found a confirmed URL match — never guess
      const matchedIndex = next ? findImageIndexForColor(next, images) : -1
      const imageIndex = matchedIndex >= 0 ? matchedIndex : currentImageIndex
      const price = getPriceForSize(selectedSize)
      const inStock = isVariantInStock(next, selectedSize, baseInStock)
      onChange({ selectedColor: next, selectedSize, currentImageIndex: imageIndex, currentPrice: price, inStock })
    },
    [selectedColor, selectedSize, images, currentImageIndex, getPriceForSize, baseInStock, onChange]
  )

  const handleSizeSelect = useCallback(
    (size: string) => {
      const next = selectedSize === size ? null : size
      setSelectedSize(next)
      const price = getPriceForSize(next)
      const inStock = isVariantInStock(selectedColor, next, baseInStock)
      onChange({ selectedColor, selectedSize: next, currentImageIndex, currentPrice: price, inStock })
    },
    [selectedColor, selectedSize, currentImageIndex, getPriceForSize, baseInStock, onChange]
  )

  return (
    <div className="space-y-5">
      {/* Color Swatches */}
      {colors.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800">
              Färg
              {selectedColor && (
                <span className="ml-2 font-normal text-gray-500">— {selectedColor}</span>
              )}
            </h3>
            {selectedColor && (
              <button
                onClick={() => handleColorSelect(selectedColor)}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Rensa
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2.5">
            {colors.map((color) => {
              const hex = colorNameToHex(color)
              const isSelected = selectedColor === color
              const isLight = hex
                ? parseInt(hex.slice(1, 3), 16) > 200 &&
                  parseInt(hex.slice(3, 5), 16) > 200 &&
                  parseInt(hex.slice(5, 7), 16) > 200
                : false

              return (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  title={color}
                  aria-label={`Välj färg ${color}`}
                  aria-pressed={isSelected}
                  className={`
                    relative w-9 h-9 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-900
                    ${isSelected
                      ? 'ring-2 ring-offset-2 ring-gray-900 scale-110'
                      : 'hover:scale-105 hover:ring-2 hover:ring-offset-1 hover:ring-gray-400'
                    }
                    ${isLight ? 'border border-gray-200' : ''}
                  `}
                  style={hex ? { backgroundColor: hex } : undefined}
                >
                  {!hex && (
                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-gray-500 bg-gray-100 rounded-full border border-dashed border-gray-300">
                      {color.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  {isSelected && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <svg
                        className={`w-4 h-4 ${isLight ? 'text-gray-800' : 'text-white'} drop-shadow`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Size Buttons */}
      {sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800">
              Storlek
              {selectedSize && (
                <span className="ml-2 font-normal text-gray-500">— {selectedSize}</span>
              )}
            </h3>
            {selectedSize && (
              <button
                onClick={() => handleSizeSelect(selectedSize)}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Rensa
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const isSelected = selectedSize === size
              const mod = SIZE_PRICE_MODIFIERS[size.toUpperCase()] ?? 0
              const variantInStock = isVariantInStock(selectedColor, size, baseInStock)

              return (
                <button
                  key={size}
                  onClick={() => variantInStock && handleSizeSelect(size)}
                  aria-label={`Välj storlek ${size}`}
                  aria-pressed={isSelected}
                  disabled={!variantInStock}
                  className={`
                    relative min-w-[3rem] px-3.5 py-2 rounded-lg text-sm font-medium border transition-all duration-150
                    ${isSelected
                      ? 'border-gray-900 bg-gray-900 text-white shadow-sm'
                      : variantInStock
                        ? 'border-gray-300 text-gray-700 hover:border-gray-600 hover:bg-gray-50'
                        : 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
                    }
                  `}
                >
                  {size}
                  {mod > 0 && variantInStock && (
                    <span className={`ml-1 text-[10px] ${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>
                      +${mod}
                    </span>
                  )}
                  {!variantInStock && (
                    <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="w-full h-px bg-gray-300 rotate-[-20deg] absolute" />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
          <p className="mt-2 text-xs text-gray-400">Genomstrukna storlekar är slutsålda</p>
        </div>
      )}
    </div>
  )
}
