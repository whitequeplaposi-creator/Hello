// Kundtyper
export interface Customer {
  id: string
  email: string
  name: string
  phone?: string
  created_at: string
  updated_at: string
  status: 'active' | 'inactive' | 'suspended'
  total_orders: number
  total_spent: number
  last_order_date?: string
  notes?: string
}

export interface CustomerAddress {
  id: string
  customer_id: string
  address_type: 'billing' | 'shipping'
  name: string
  street: string
  postal_code: string
  city: string
  country: string
  phone?: string
  is_default: boolean
  created_at: string
}

export interface CustomerPaymentMethod {
  id: string
  customer_id: string
  payment_type: 'card' | 'invoice' | 'other'
  card_brand?: string
  card_last_four?: string
  card_expiry?: string
  is_default: boolean
  created_at: string
}

export interface Order {
  id: string
  customer_id: string
  order_number: string
  status: 'confirmed' | 'packing' | 'transport' | 'delivered'
  total_amount: number
  currency: string
  payment_method?: string
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  shipping_address_id?: string
  billing_address_id?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
  size?: string
  color?: string
  image?: string
  created_at: string
}

export interface Shipment {
  id: string
  order_id: string
  tracking_number?: string
  carrier: 'PostNord' | 'DHL' | 'DB Schenker' | 'Bring' | 'Other'
  status: 'confirmed' | 'packing' | 'transport' | 'delivered'
  shipped_date?: string
  estimated_delivery_date?: string
  actual_delivery_date?: string
  shipping_address: string
  weight_kg?: number
  dimensions?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface ShipmentEvent {
  id: string
  shipment_id: string
  status: string
  location?: string
  description: string
  event_date: string
  created_at: string
}

// Utökade typer med relationer
export interface OrderWithDetails extends Order {
  items?: OrderItem[]
  shipment?: Shipment
  shipping_address?: CustomerAddress
  billing_address?: CustomerAddress
}

export interface ShipmentWithEvents extends Shipment {
  events?: ShipmentEvent[]
  order?: Order
}
