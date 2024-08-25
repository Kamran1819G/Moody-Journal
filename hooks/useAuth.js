'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '@/utils/supabase'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)
        setLoading(false)
        if (event === 'SIGNED_IN') {
          await handleSignIn(currentUser)
        } else if (event === 'SIGNED_OUT') {
          router.push('/sign-in')
        }
      }
    )

    checkUser()

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router])

  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setUser(user)
    setLoading(false)
  }

  async function handleSignIn(user) {
    if (user) {
      const { data, error } = await supabase
        .from('users')
        .select()
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking user:', error)
        return
      }

      if (!data) {
        await createUserInDatabase(
          user.id,
          user.email,
          user.user_metadata.name || user.email
        )
      }

      router.push('/journal')
    }
  }

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  async function signUp(email, password, name) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name: name, full_name: name },
      },
    })

    if (error) throw error

    if (data.user) {
      await createUserInDatabase(data.user.id, email, name)
    }
  }

  async function signUpWithSocial(provider) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/new-user`,
      },
    })

    if (data.user) {
      createUserInDatabase(
        data.user.id,
        data.user.email,
        data.user.user_metadata.name || data.user.email
      )
    }

    if (error) throw error

    if (data.url) {
      window.location.href = data.url
    }
  }

  async function signInWithSocial(provider) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/journal`,
      },
    })

    if (error) throw error

    if (data.url) {
      window.location.href = data.url
    }
  }

  async function createUserInDatabase(id, email, name) {
    const { error } = await supabase.from('users').insert([{ id, email, name }])

    if (error && error.code === '23505') {
      console.log('User already exists in the database')
    } else if (error) {
      console.error('Error creating user in database:', error)
      throw error
    }
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signInWithSocial,
    signUpWithSocial,
    signOut,
  }
}
