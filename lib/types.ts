export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  inStock: boolean
  image?: string
  images?: string[]
  colors?: string[]
  sizes?: string[]
}

export interface CartItem {
  product: Product
  quantity: number
  selectedSize?: string
  selectedColor?: string
}

export interface User {
  id: string
  email: string
  name: string
}
