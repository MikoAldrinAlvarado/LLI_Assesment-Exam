const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('stockwise_token')
  const response = await fetch(`${apiBaseUrl}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Unable to complete the request.')
  }

  return data
}
