// Login page for SPPG Hub Purwakarta

import { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Login - SPPG Hub Purwakarta',
  description: 'Masuk ke sistem SPPG Hub Purwakarta untuk mengelola menu makanan sekolah'
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-card dark:bg-card rounded-xl shadow-xl border border-border p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              SPPG Hub Purwakarta
            </h1>
            <p className="text-sm text-muted-foreground">
              Satuan Pelayanan Pemenuhan Gizi
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Kabupaten Purwakarta, Jawa Barat
            </p>
          </div>

          {/* Login Form */}
          <LoginForm />

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-muted-foreground">
            <p>© 2025 SPPG Hub Purwakarta</p>
            <p className="mt-1">
              Dikembangkan untuk Program Makan Bergizi Gratis (MBG) - Kabupaten Purwakarta
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}