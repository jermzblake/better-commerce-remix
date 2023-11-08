import type { Category } from './category.types'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  quantity: number
  size: string
  media: ProductMedia
  categories?: Category[]
  // orderItems?: OrderItem[]
}

export interface ProductMedia {
  thumbnail: string
  hero: string
  gallery: string[]
  video: string
}

export interface CartProduct {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}