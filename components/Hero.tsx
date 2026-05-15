'use client'

import HeroCarousel from './HeroCarousel'
import HeroShein from './HeroShein'
import { Product } from '@/lib/types'

interface HeroProps {
  products: Product[]
  variant?: 'carousel' | 'shein'
}

export default function Hero({ products, variant = 'shein' }: HeroProps) {
  if (variant === 'shein') {
    return <HeroShein products={products} />
  }
  
  return <HeroCarousel products={products} />
}