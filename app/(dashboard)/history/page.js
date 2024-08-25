'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import supabase from '@/utils/supabase'
import HistoryChart from '@/components/HistoryChart'
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react'

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState([])
  const [average, setAverage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          throw new Error('User not authenticated')
        }

        const { data, error } = await supabase
          .from('entry_analysis')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })

        if (error) {
          throw error
        }

        setAnalyses(data)

        const total = data.reduce((acc, curr) => acc + curr.sentiment_score, 0)
        const avg = data.length > 0 ? total / data.length : 0
        setAverage(avg)
      } catch (err) {
        console.error('Error fetching analyses:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-black">
        <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-black text-white"
      >
        <h2 className="text-3xl font-bold mb-4">Error</h2>
        <p className="text-xl text-red-400">{error}</p>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 bg-opacity-50 shadow-lg rounded-lg p-6 mb-8"
        >
          <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Sentiment History
          </h1>
          <div className="flex items-center">
            <p className="text-xl text-gray-300 mr-2">Average Sentiment:</p>
            <span
              className={`text-2xl font-semibold flex items-center ${
                average > 0
                  ? 'text-green-400'
                  : average < 0
                  ? 'text-red-400'
                  : 'text-gray-400'
              }`}
            >
              {average > 0 ? (
                <TrendingUp className="w-6 h-6 mr-1" />
              ) : average < 0 ? (
                <TrendingDown className="w-6 h-6 mr-1" />
              ) : null}
              {average.toFixed(2)}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-800 bg-opacity-50 shadow-lg rounded-lg p-6"
        >
          <div className="h-[60vh] w-full">
            <HistoryChart data={analyses} />
          </div>
        </motion.div>

        {analyses.length === 0 && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center text-gray-400 mt-8 text-lg"
          >
            No sentiment data available yet. Start journaling to see your
            sentiment history!
          </motion.p>
        )}
      </div>
    </div>
  )
}
