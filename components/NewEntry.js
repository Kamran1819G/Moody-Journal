import React from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { PlusCircle } from 'lucide-react'
import supabase from '@/utils/supabase'

const NewEntry = () => {
  const router = useRouter()

  const handleOnClick = async () => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError) throw new Error(`Failed to get user: ${userError.message}`)

      const { data: entryData, error: entryError } = await supabase
        .from('journal_entries')
        .insert({
          content: 'New Entry',
          user_id: userData.user.id,
          status: 'DRAFT',
        })
        .select()

      console.log('entryData:', entryData)

      const { data: entryAnalysisData, error: entryAnalysisError } =
        await supabase
          .from('entry_analyses')
          .insert({
            user_id: userData.user.id,
            entry_id: entryData[0].id,
            mood: 'NEUTRAL',
            negative: false,
            sentiment_score: 0,
            subject: 'None',
            summary: 'None',
            color: '#0101fe',
          })
          .select()

      if (entryError)
        throw new Error(`Failed to create new entry: ${entryError.message}`)
      if (entryAnalysisError)
        throw new Error(
          `Failed to create new entry analysis: ${entryAnalysisError.message}`
        )

      router.push(`/journal/${entryData[0].id}`)
    } catch (error) {
      console.error(error)
      // You might want to add some user feedback here, like a toast notification
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="cursor-pointer overflow-hidden rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 shadow-lg"
      onClick={handleOnClick}
    >
      <div className="px-6 py-8 sm:p-10 flex items-center justify-center">
        <PlusCircle className="w-8 h-8 text-white mr-3" />
        <span className="text-2xl font-bold text-white">New Entry</span>
      </div>
    </motion.div>
  )
}

export default NewEntry
