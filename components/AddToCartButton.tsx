'use client'

import { Product } from '../lib/types'
import { useCart } from '../lib/CartContext'

interface AddToCartButtonProps {
  product: Product
  selectedSize?: string
  selectedColor?: string
}

export default function AddToCartButton({ product, selectedSize, selectedColor }: AddToCartButtonProps) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor)
  }

  const isDisabled = false

  return (
    <button
      onClick={handleAddToCart}
      disabled={isDisabled}
      className={`p-2 rounded transition-colors ${
        isDisabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
      aria-label="Lägg i varukorg"
    >
      <img src="/shopping-cart-simple-thin.svg" alt="Varukorg" className="w-6 h-6" />
    </button>
  )
}
