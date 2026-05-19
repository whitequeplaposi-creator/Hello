'use client'

import HeroCarousel from './HeroCarousel'
import HeroShein from './HeroShein'
import { Product } from '@/lib/types'

interface HeroProps {
  products: Product[]
  variant?: 'carousel' | 'shein'
  onOpenCart?: () => void
}

export default function Hero({ products, variant = 'shein', onOpenCart }: HeroProps) {
  if (variant === 'shein') {
    return <HeroShein products={products} onOpenCart={onOpenCart} />
  }
  
  return <HeroCarousel products={products} />
}