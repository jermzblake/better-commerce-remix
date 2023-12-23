import type { OrderItem } from './index'

export interface Order {
  id?: string
  memberId?: string
  shippingAddress: any
  totalAmount: string
  orderItems?: OrderItem[]
  customerEmail: string
  customerFirstName: string 
  customerLastName: string 
  customerPhoneNumber?: string
  status: string
}