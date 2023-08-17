import type { Product } from './index'

export interface Category {
  name: string
  products?: Product[]
}