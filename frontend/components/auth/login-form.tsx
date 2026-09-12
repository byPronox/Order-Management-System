'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message ?? 'Invalid credentials')
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-black/60">Email</label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-black/30"
          placeholder="you@company.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-black/60">Password</label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-black/30"
          placeholder="••••••••"
        />
      </div>

      {error && <p className="text-xs font-medium text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 flex h-12 items-center justify-center rounded-full bg-black text-sm font-semibold text-white transition hover:bg-black/85 disabled:opacity-50"
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}