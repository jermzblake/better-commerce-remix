export interface Product {
  id: string
  name: string
  description: string
  price: string
  quantity: number
  size: string
  media: ProductMedia
  // categories?: Category[]
  // orderItems?: OrderItem[]
}

export interface ProductMedia {
  thumbnail: string
  hero: string
  gallery: string[]
  video: string
}