'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Editor from '@/components/Editor'
import supabase from '@/utils/supabase'
import { Loader2 } from 'lucide-react'

const JournalEditorPage = ({ params }) => {
  const [entry, setEntry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const getEntry = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) {
        setError('Authentication error. Please log in again.')
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('journal_entries')
        .select('*, analysis(*)')
        .eq('user_id', user.id)
        .eq('id', params.id)
        .single()

      if (error) {
        setError('Error fetching entry. Please try again.')
        setLoading(false)
        return
      }

      setEntry(data)
      setLoading(false)
    }

    getEntry()
  }, [supabase, params.id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>
  }

  if (!entry) {
    return <div className="text-center mt-8">Entry not found.</div>
  }

  return (
    <div className="w-full h-full">
      <Editor entry={entry} />
    </div>
  )
}

export default JournalEditorPage
