import { apiRequest } from './apiClient.js'

export function getDashboardSummary() {
  return apiRequest('/dashboard/summary')
}

export function getLowStockProducts() {
  return apiRequest('/products/low-stock')
}
