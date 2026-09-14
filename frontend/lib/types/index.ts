export type OrderStatus = 'pending' | 'completed' | 'cancelled'
export type CustomerType = 'individual' | 'smb' | 'enterprise'
export type CustomerStatus = 'active' | 'paused'
export type ProductStatus = 'active' | 'draft' | 'out_of_stock'
export type UserRole = 'admin' | 'user'

export interface Customer {
  id: number
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

export interface Product {
  id: number
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
  id: number
  productId: number
  product?: Pick<Product, 'id' | 'name' | 'sku'>
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface Order {
  id: number
  customerId: number
  customer?: Pick<Customer, 'id' | 'name' | 'email'>
  status: OrderStatus
  totalAmount: number
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

export interface User {
  id: number
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

export interface WorkspaceSettingsData {
  workspaceId: number
  workspaceName: string
  defaultTimezone: string
  defaultCurrency: string
  defaultOrderStatus: string
  requireOrderReview: boolean
  allowPartialFulfillment: boolean
  notifyCustomersOnStatus: boolean
}

// --- Payloads de Mutación (DRY) ---

// Heredan de la entidad principal pero quitan campos autogenerados
export type CreateCustomerPayload = Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'customerType' | 'status'> & {
  customerType?: string
  status?: string
}
export type UpdateCustomerPayload = Partial<CreateCustomerPayload>

export type CreateProductPayload = Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'status'> & {
  status?: string
}
export type UpdateProductPayload = Partial<CreateProductPayload>

export type UpdateWorkspaceSettingsPayload = Partial<Omit<WorkspaceSettingsData, 'workspaceId' | 'workspaceName'>>

// --- Sumarios y Dashboards ---

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