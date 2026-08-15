import { apiRequest } from './apiClient.js'

export function getWeeklySalesReport() {
  return apiRequest('/reports/sales/weekly')
}
