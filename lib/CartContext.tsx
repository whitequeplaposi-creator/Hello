'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Product, CartItem } from './types'

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product, selectedSize?: string, selectedColor?: string) => void
  removeFromCart: (productId: string, selectedSize?: string, selectedColor?: string) => void
  updateQuantity: (productId: string, quantity: number, selectedSize?: string, selectedColor?: string) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export { CartContext }

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isClient, setIsClient] = useState(false)

  // Set isClient flag on mount
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && isClient) {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart))
        } catch (error) {
          console.error('Error loading cart from localStorage:', error)
        }
      }
    }
  }, [isClient])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && isClient) {
      localStorage.setItem('cart', JSON.stringify(items))
    }
  }, [items, isClient])

  const addToCart = (product: Product, selectedSize?: string, selectedColor?: string) => {
    setItems((prevItems) => {
      // Match on product id + size + color so different variants are separate cart lines
      const existingItem = prevItems.find(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      )
      
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      
      return [...prevItems, { product, quantity: 1, selectedSize, selectedColor }]
    })
  }

  const removeFromCart = (productId: string, selectedSize?: string, selectedColor?: string) => {
    setItems((prevItems) => prevItems.filter((item) =>
      !(item.product.id === productId &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor)
    ))
  }

  const updateQuantity = (productId: string, quantity: number, selectedSize?: string, selectedColor?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize, selectedColor)
      return
    }
    
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
