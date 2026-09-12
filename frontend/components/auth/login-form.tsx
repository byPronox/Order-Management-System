'use client'

import { useState } from 'react'
import { Spinner } from '@/components/ui/loading'

export function LoginForm() {
  const [isPending, setIsPending] = useState(false)
  const [message, setMessage] = useState('')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')
    setIsPending(true)
    window.setTimeout(() => {
      setIsPending(false)
      setMessage('Authentication is ready to connect to your workspace.')
    }, 700)
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <label className="flex flex-col gap-2 text-sm font-medium text-[#111]">
        Work email
        <input name="email" type="email" required autoComplete="email" placeholder="you@company.com" className="h-12 rounded-xl border border-black/15 bg-white px-4 text-sm outline-none transition placeholder:text-black/30 focus:border-black focus:ring-4 focus:ring-black/5" />
      </label>
      <label className="flex flex-col gap-2 text-sm font-medium text-[#111]">
        Password
        <input name="password" type="password" required minLength={8} autoComplete="current-password" placeholder="Enter your password" className="h-12 rounded-xl border border-black/15 bg-white px-4 text-sm outline-none transition placeholder:text-black/30 focus:border-black focus:ring-4 focus:ring-black/5" />
      </label>
      <button type="submit" disabled={isPending} className="button-dark mt-1 w-full disabled:cursor-wait disabled:opacity-60">
        {isPending ? <Spinner label="Signing in" /> : 'Continue to workspace'}
      </button>
      {message ? <p className="rounded-xl bg-emerald-50 px-4 py-3 text-center text-xs text-emerald-700" role="status">{message}</p> : null}
    </form>
  )
}
