export type OrderStatus = 'pending' | 'completed' | 'cancelled'
export type CustomerType = 'individual' | 'smb' | 'enterprise'
export type CustomerStatus = 'active' | 'paused'
export type ProductStatus = 'active' | 'draft' | 'out_of_stock'
export type UserRole = 'admin' | 'user'

export interface Customer {
  id: string
  name: string
  email: string
  companyName?: string
  customerType: CustomerType
  phone?: string
  address?: string
  status: CustomerStatus
  createdAt: string
  updatedAt: string
}

export interface CreateCustomerPayload {
  name: string
  email: string
  companyName?: string
  customerType?: string
  phone?: string
  address?: string
  status?: string
}

export interface Product {
  id: string
  name: string
  description?: string
  category?: string
  sku?: string
  price: number
  stock?: number
  status: ProductStatus
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  productId: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface Order {
  id: string
  customerId: string
  customer?: { id: string; name: string; email: string }
  status: OrderStatus
  totalAmount: number
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: string
}

export interface Workspace {
  id: number
  name: string
  slug: string
}

export interface DashboardSummary {
  metrics: {
    totalCustomers: number
    customersGrowthPercent: number
    totalProducts: number
    lowStockCount: number
    totalOrders: number
    ordersGrowthPercent: number
    totalRevenue: number
    revenueCompleted: number
    revenuePending: number
  }
  ordersByStatus: { status: OrderStatus; count: number; percentage: number }[]
  conversionRate: number
  recentOrders: {
    id: number
    customerName: string
    customerEmail: string
    status: OrderStatus
    totalAmount: number
    createdAt: string
  }[]
}

export interface OrderSummary {
  totalOrders: number
  ordersGrowthPercent: number
  pendingFulfillment: number
  revenueThisMonth: number
  revenueGrowthPercent: number
}

export interface CreateProductPayload {
  name: string
  description?: string
  category?: string
  sku?: string
  price: number
  stock?: number
  status?: string
}