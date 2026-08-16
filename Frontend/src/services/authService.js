import { apiRequest } from './apiClient.js'

export function login(username, password) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}
