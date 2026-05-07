'use client'

import { useState, useEffect } from 'react';
import { Product } from '@/lib/types';
import AddToCartButton from '@/components/AddToCartButton';

// Mock data for development - replace with actual API call
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'T-shirt',
    description: 'Bekväm t-shirt i bomull',
    price: 299,
    category: 'kläder',
    inStock: true,
    image: '/tshirt.jpg',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: '2',
    name: 'Jeans',
    description: 'Slim fit jeans',
    price: 799,
    category: 'kläder',
    inStock: true,
    image: '/jeans.jpg',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: '3',
    name: 'Hoodie',
    description: 'Varm hoodie med fickor',
    price: 599,
    category: 'kläder',
    inStock: true,
    image: '/hoodie.jpg',
    sizes: ['M', 'L', 'XL', 'XXL']
  }
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Replace with actual API call when available
    setProducts(mockProducts);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Produkter</h1>
      
      {products.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>Inga produkter tillgängliga just nu.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: Product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">Ingen bild</span>
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                {product.description && (
                  <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                )}
                

                
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-green-600">
                    ${product.price}
                  </span>
                  <AddToCartButton 
                    product={product} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
