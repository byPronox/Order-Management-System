import Link from 'next/link'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { BrandMark } from '@/components/brand-mark'
import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#fdfbfa] text-[#111]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-6 py-6 sm:px-10 lg:px-16">
        <header className="flex items-center justify-between">
          <BrandMark href="/" />
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.14em] text-black/50 transition hover:text-black">
            <ArrowLeft size={14} aria-hidden="true" /> Back home
          </Link>
        </header>

        <div className="grid flex-1 items-center py-16 lg:grid-cols-[.9fr_1.1fr] lg:gap-24">
          <section className="hidden lg:block">
            <p className="eyebrow text-black/40">Operations, in order</p>
            <h1 className="mt-5 max-w-xl font-display text-6xl leading-[.95] tracking-[-.07em] text-[#111] xl:text-8xl">
              Your orders,<br />
              <span className="text-black/25">in motion.</span>
            </h1>
            <p className="mt-8 max-w-md text-base leading-7 text-black/55">Connect every channel, warehouse, and customer to one calm operational layer.</p>
            <div className="mt-12 flex items-center gap-3 text-xs text-black/45">
              <ShieldCheck size={16} aria-hidden="true" /> Secure workspace access
            </div>
          </section>

          <section className="mx-auto w-full max-w-md rounded-[28px] border border-black/10 bg-white p-7 shadow-[0_24px_80px_rgba(24,20,18,.08)] sm:p-10" aria-labelledby="login-title">
            <div className="mb-8">
              <p className="eyebrow mb-3 text-black/40">Welcome back</p>
              <h2 id="login-title" className="font-display text-3xl tracking-[-.06em]">Sign in to Orderly</h2>
              <p className="mt-2 text-sm leading-6 text-black/50">Use your workspace credentials to continue.</p>
            </div>
            <LoginForm />
            <p className="mt-7 text-center text-xs leading-5 text-black/40">By continuing, you agree to our terms and privacy policy.</p>
          </section>
        </div>

        <footer className="flex flex-col gap-2 border-t border-black/10 pt-5 text-[10px] uppercase tracking-[.14em] text-black/35 sm:flex-row sm:justify-between">
          <span>Orderly Inc.</span>
          <span>Built for modern operations</span>
        </footer>
      </div>
    </main>
  )
}
