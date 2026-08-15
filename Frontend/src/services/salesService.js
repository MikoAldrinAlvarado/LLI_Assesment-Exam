import { apiRequest } from './apiClient.js'

export function createSale(items) {
  return apiRequest('/sales', {
    method: 'POST',
    body: JSON.stringify({ items }),
  })
}
