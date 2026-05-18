'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  price: number
  images: string[]
}

export default function FooterProductStrip() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products?limit=20&refresh=true')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          const shuffled = [...data.products].sort(() => Math.random() - 0.5)
          setProducts(shuffled.slice(0, 4))
        }
      })
      .catch(() => {
        // silently fail — renders nothing
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading || products.length === 0) return null

  return (
    <div className="border-t border-gray-100 bg-white">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="grid grid-cols-4 gap-4">
          {products.map(product => (
            <Link
              key={product.id}
              href={`/produkt/${product.id}`}
              className="group block"
            >
              <div className="aspect-square relative overflow-hidden bg-gray-50 mb-2">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:opacity-75 transition-opacity duration-200"
                    sizes="(max-width: 640px) 25vw, 150px"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
              </div>
              <p className="text-xs text-gray-700 leading-snug line-clamp-2">{product.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">${product.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
