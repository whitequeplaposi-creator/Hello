'use client'

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth'
import { auth } from './firebase'
import { User } from './types'

async function fetchDbCustomerIdForEmail(email: string): Promise<string | null> {
  try {
    const res = await fetch(`/api/customers?email=${encodeURIComponent(email)}`)
    if (!res.ok) return null
    const data = await res.json()
    if (data.success && data.customer?.id) return data.customer.id as string
  } catch {
    /* ignore */
  }
  return null
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  alignCustomerId: (customerId: string) => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const alignCustomerId = useCallback((customerId: string) => {
    setUser((prev) => {
      if (!prev || prev.id === customerId) return prev
      return { ...prev, id: customerId }
    })
  }, [])

  // Lyssna på Firebase Auth-tillstånd
  useEffect(() => {
    // Om Firebase inte är konfigurerat, sätt isLoading till false direkt
    if (!auth) {
      setIsLoading(false)
      return
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const dbId = await fetchDbCustomerIdForEmail(firebaseUser.email!)
        setUser({
          id: dbId ?? firebaseUser.uid,
          email: firebaseUser.email!,
          name: firebaseUser.displayName ?? '',
        })
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!auth) {
      console.error('Firebase är inte konfigurerat')
      return false
    }
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password)
      const dbId = await fetchDbCustomerIdForEmail(email)
      setUser({
        id: dbId ?? credential.user.uid,
        email: credential.user.email!,
        name: credential.user.displayName ?? '',
      })
      return true
    } catch (error: any) {
      console.error('Firebase login error:', error.code, error.message)
      return false
    }
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    if (!auth) {
      console.error('Firebase är inte konfigurerat')
      return false
    }
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(credential.user, { displayName: name })
      const userId = credential.user.uid
      try {
        await fetch('/api/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: userId, email, name }),
        })
      } catch (err) {
        console.error('Failed to create customer in database:', err)
      }
      setUser({ id: userId, email, name })
      return true
    } catch (error: any) {
      console.error('Firebase register error:', error.code, error.message)
      return false
    }
  }

  const logout = async () => {
    if (auth) {
      await signOut(auth)
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        alignCustomerId,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
