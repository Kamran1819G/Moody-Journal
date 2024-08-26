'use client'
import { useState } from 'react'
import { useAutosave } from 'react-autosave'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, Save, Trash2 } from 'lucide-react'
import supabase from '@/utils/supabase'

const Editor = ({ entry }) => {
  const [text, setText] = useState(entry.content)
  const [currentEntry, setEntry] = useState(entry)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', entry.id)

    if (error) {
      console.error('Error deleting entry:', error)
    } else {
      router.push('/journal')
    }
  }

  useAutosave({
    data: text,
    onSave: async (_text) => {
      if (_text === entry.content) return
      setIsSaving(true)
      const { data, error } = await supabase
        .from('journal_entries')
        .update({ content: _text })
        .eq('id', entry.id)
        .select('*, analysis(*)')
        .single()

      if (error) {
        console.error('Error updating entry:', error)
      } else {
        setEntry(data)
      }
      setIsSaving(false)
    },
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full grid grid-cols-1 lg:grid-cols-3 gap-4 relative bg-gray-900 text-white p-4 rounded-lg"
    >
      <div className="absolute right-4 top-4 flex items-center space-x-2">
        {isSaving ? (
          <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
        ) : (
          <Save className="w-5 h-5 text-green-500" />
        )}
      </div>
      <div className="lg:col-span-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-full text-xl p-6 bg-gray-800 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="border-l border-gray-700 p-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ background: currentEntry.analysis.color }}
          className="h-[100px] rounded-t-lg text-white p-6 mb-4"
        >
          <h2 className="text-2xl font-bold">Analysis</h2>
        </motion.div>
        <div className="space-y-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800 p-4 rounded-lg"
          >
            <h3 className="text-lg font-semibold mb-2">Subject</h3>
            <p className="text-xl">{currentEntry.analysis.subject}</p>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800 p-4 rounded-lg"
          >
            <h3 className="text-lg font-semibold mb-2">Mood</h3>
            <p className="text-xl">{currentEntry.analysis.mood}</p>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800 p-4 rounded-lg"
          >
            <h3 className="text-lg font-semibold mb-2">Sentiment</h3>
            <p className="text-xl">
              {currentEntry.analysis.negative ? 'Negative' : 'Positive'}
            </p>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6"
          >
            <button
              onClick={handleDelete}
              type="button"
              className="w-full flex items-center justify-center space-x-2 rounded-md bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            >
              <Trash2 className="w-5 h-5" />
              <span>Delete Entry</span>
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default Editor
