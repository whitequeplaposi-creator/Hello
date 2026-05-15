'use client'

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react'
import { User } from './types'

async function fetchDbCustomerIdForEmail(email: string): Promise<string | null> {
  try {
    const res = await fetch(`/api/customers?email=${encodeURIComponent(email)}`)
    // 404 means the customer doesn't exist in the DB yet — not an error
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
  /** När order-API returnerar annat kund-id än sessionen (t.ex. gammalt numeriskt localStorage-id). */
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
      const next = { ...prev, id: customerId }
      localStorage.setItem('user', JSON.stringify(next))
      return next
    })
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser) as User
          if (!cancelled) setUser(parsed)
          const dbId = parsed.email ? await fetchDbCustomerIdForEmail(parsed.email) : null
          if (!cancelled && dbId && dbId !== parsed.id) {
            const updated = { ...parsed, id: dbId }
            setUser(updated)
            localStorage.setItem('user', JSON.stringify(updated))
          }
        } catch (error) {
          console.error('Error loading user from localStorage:', error)
          localStorage.removeItem('user')
        }
      }
      if (!cancelled) setIsLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const foundUser = users.find(
      (u: any) => u.email === email && u.password === password
    )

    if (foundUser) {
      // Hämta korrekt customer ID från databasen
      try {
        const response = await fetch(`/api/customers?email=${encodeURIComponent(email)}`)
        const data = response.ok ? await response.json() : null
        
        let customerId = foundUser.id
        if (data?.success && data.customer) {
          // Använd customer ID från databasen
          customerId = data.customer.id
          console.log('✅ Using customer ID from database:', customerId)
        }
        
        const userData = { id: customerId, email: foundUser.email, name: foundUser.name }
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        return true
      } catch (error) {
        console.error('Error fetching customer ID:', error)
        // Fallback till localStorage ID
        const userData = { id: foundUser.id, email: foundUser.email, name: foundUser.name }
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        return true
      }
    }
    return false
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      // Spara i localStorage (för autentisering)
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      
      if (users.find((u: any) => u.email === email)) {
        return false
      }

      const userId = `cust_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

      const newUser = {
        id: userId,
        email,
        password,
        name,
      }

      users.push(newUser)
      localStorage.setItem('users', JSON.stringify(users))

      // Skapa kund i databasen
      try {
        await fetch('/api/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: userId,
            email,
            name
          })
        })
      } catch (error) {
        console.error('Failed to create customer in database:', error)
      }

      const userData = { id: newUser.id, email: newUser.email, name: newUser.name }
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      return true
    } catch (error) {
      console.error('Registration error:', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
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
