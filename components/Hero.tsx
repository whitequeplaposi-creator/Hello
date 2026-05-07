'use client'

import HeroCarousel from './HeroCarousel'
import { Product } from '@/lib/types'

interface HeroProps {
  products: Product[]
}

export default function Hero({ products }: HeroProps) {
  return <HeroCarousel products={products} />
}