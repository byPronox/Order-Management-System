export type OrderStatus = 'pending' | 'completed' | 'cancelled'
export type CustomerType = 'individual' | 'smb' | 'enterprise'
export type CustomerStatus = 'active' | 'paused'
export type ProductStatus = 'active' | 'draft' | 'out_of_stock'
export type UserRole = 'admin' | 'user'

export interface Customer { id: string; name: string; email: string; phone: string; address: string; type: CustomerType; status: CustomerStatus; createdAt: string; updatedAt: string }
export interface Product { id: string; name: string; description: string; sku: string; price: number; stock: number; imageUrl: string; status: ProductStatus; createdAt: string; updatedAt: string }
export interface OrderItem { id: string; productId: string; quantity: number; unitPrice: number; subtotal: number }
export interface Order { id: string; customerId: string; status: OrderStatus; totalAmount: number; items: OrderItem[]; createdAt: string; updatedAt: string }
export interface User { id: string; email: string; name: string; role: UserRole; createdAt: string }
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