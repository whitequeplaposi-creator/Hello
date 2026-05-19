'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/AuthContext'
import { useLanguage } from '@/lib/LanguageContext'
import BrandmarkLogo from '@/components/BrandmarkLogo'
import SocialAuthButtons from '@/components/SocialAuthButtons'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { register } = useAuth()
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name || !email || !password || !confirmPassword) { setError(t('fillAllFields')); return }
    if (password !== confirmPassword) { setError(t('passwordsDontMatch')); return }
    if (password.length < 6) { setError(t('passwordTooShort')); return }
    setIsLoading(true)
    const result = await register(email, password, name)
    setIsLoading(false)
    if (result.success) { router.push('/') }
    else { setError(result.error || t('emailAlreadyExists')) }
  }

  const inputClass = "w-full px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent transition-all text-gray-900"
  const inputWithIconClass = "w-full px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent transition-all pr-10 text-gray-900"
  const labelClass = "block text-xs font-medium text-gray-700 mb-1"

  const EyeIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
  const EyeOffIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Topbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <BrandmarkLogo size="sm" showText={true} variant="default" />
        <Link href="/" aria-label="Stäng" className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-800">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Link>
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-4">
        <div className="w-full max-w-2xl">
          <div className="mb-4 text-center">
            <h1 className="text-xl font-bold text-gray-900 mb-1">{t('createAccount')}</h1>
            <p className="text-gray-500 text-xs">{t('createAccountSubtitle')}</p>
          </div>

          {error && (
            <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-md text-red-600 text-xs">
              {error}
            </div>
          )}

          {/* Tvåkolumnslayout */}
          <div className="flex gap-6 items-start">
            {/* Vänster: formulär */}
            <div className="flex-1">
              <form onSubmit={handleSubmit} className="space-y-2.5">
                <div>
                  <label htmlFor="name" className={labelClass}>{t('fullName')}</label>
                  <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} disabled={isLoading} />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>{t('email')}</label>
                  <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} disabled={isLoading} />
                </div>
                <div>
                  <label htmlFor="password" className={labelClass}>{t('password')}</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputWithIconClass} disabled={isLoading} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" disabled={isLoading}>
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="confirmPassword" className={labelClass}>{t('confirmPassword')}</label>
                  <div className="relative">
                    <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputWithIconClass} disabled={isLoading} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" disabled={isLoading}>
                      {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={isLoading} className="w-full px-3 py-1.5 text-sm bg-gray-900 text-white font-medium rounded-md hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-1">
                  {isLoading ? (
                    <><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>{t('creatingAccount')}</>
                  ) : t('createAccountBtn')}
                </button>
              </form>
            </div>

            {/* Avdelare */}
            <div className="flex flex-col items-center gap-2 pt-5">
              <div className="w-px h-16 bg-gray-200" />
              <span className="text-xs text-gray-400">eller</span>
              <div className="w-px h-16 bg-gray-200" />
            </div>

            {/* Höger: social auth */}
            <div className="flex-1 pt-5">
              <SocialAuthButtons mode="register" />
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-gray-600 text-xs">
              {t('alreadyHaveAccount')}{' '}
              <Link href="/login" className="text-black font-medium hover:underline">{t('loginHere')}</Link>
            </p>
          </div>
          <p className="text-center text-gray-500 text-xs mt-2">{t('termsText')}</p>
        </div>
      </main>
    </div>
  )
}
