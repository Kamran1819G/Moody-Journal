'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function NewUser() {
  const [error, setError] = useState(null)
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/journal')
      } else {
        setError('Please Wait. Redirecting to Sign In...')
        setTimeout(() => router.push('/sign-in'), 3000)
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      {error ? (
        <div className="text-white text-center">
          <p>{error}</p>
        </div>
      ) : (
        <div className="text-white text-center">
          <p>Setting up your account...</p>
        </div>
      )}
    </div>
  )
}
