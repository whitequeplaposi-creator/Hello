'use client'

import { useState } from 'react'

interface SizeSelectorProps {
  sizes?: string[]
  selectedSize?: string
  onSizeSelect: (size: string) => void
}

export default function SizeSelector({ sizes = [], selectedSize, onSizeSelect }: SizeSelectorProps) {
  if (!sizes || sizes.length === 0) {
    return null
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Storlek
      </label>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSizeSelect(size)}
            className={`px-4 py-2 border rounded-md transition-colors ${
              selectedSize === size
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  )
}
