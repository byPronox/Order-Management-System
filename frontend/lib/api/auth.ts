export const authApi = {
  login: async (credentials: Record<string, string>) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => null)
      throw new Error(data?.message ?? 'Invalid credentials')
    }

    return response.json()
  },

  logout: async () => {
    const response = await fetch('/api/auth/logout', { 
      method: 'POST' 
    })
    
    if (!response.ok) {
      throw new Error('Failed to logout')
    }
  },
}