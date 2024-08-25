'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import EntryCard from '@/components/EntryCard'
import NewEntry from '@/components/NewEntry'
import Question from '@/components/Question'
import supabase from '@/utils/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export default function JournalPage() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchEntries() {
      setLoading(true)
      setError(null)
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) {
          throw new Error(`Authentication error: ${userError.message}`)
        }

        if (!user) {
          throw new Error('User not authenticated')
        }

        const { data, error: entriesError } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (entriesError) {
          throw new Error(`Failed to fetch entries: ${entriesError.message}`)
        }

        console.log('Fetched entries:', data) // Log the fetched data
        setEntries(data || [])
      } catch (err) {
        console.error('Error in fetchEntries:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEntries()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        Loading...
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 text-center mt-8">Error: {error}</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-8">
          Your Journal
        </h1>

        <Card className="mb-12 bg-gray-800 text-gray-300">
          <CardContent className="p-6">
            <Question />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 mb-6">
            <NewEntry />
          </div>

          {entries.map((entry) => (
            <Link
              key={entry.id}
              href={`/journal/${entry.id}`}
              className="transform transition duration-300 hover:scale-105"
            >
              <EntryCard entry={entry} />
            </Link>
          ))}
        </div>

        {entries.length === 0 && (
          <p className="text-center text-gray-400 mt-8">
            No journal entries yet. Start by creating a new entry!
          </p>
        )}
      </div>
    </div>
  )
}
