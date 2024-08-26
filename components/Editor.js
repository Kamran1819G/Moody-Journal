'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, Save, Trash2 } from 'lucide-react'
import supabase from '@/utils/supabase'
import { analyzeEntry } from '@/utils/api'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'

const DeleteConfirmationDialog = ({ onDelete }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          className="w-full flex items-center justify-center space-x-2 rounded-md bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
        >
          <Trash2 className="w-5 h-5" />
          <span>Delete Entry</span>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this entry?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            journal entry.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

const Editor = ({ entry }) => {
  const [text, setText] = useState(entry.content)
  const [currentEntry, setCurrentEntry] = useState(entry)
  const [isSaving, setIsSaving] = useState(false)
  const [autoSave, setAutoSave] = useState(true)
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

  const saveEntry = useCallback(async () => {
    if (text === currentEntry.content) return
    setIsSaving(true)
    try {
      const analysis = await analyzeEntry(entry)
      const { data, error } = await supabase
        .from('journal_entries')
        .update({ content: text })
        .eq('id', entry.id)
        .select('*')
        .single()

      if (error) throw error

      if (analysis) {
        const { error: analysisError } = await supabase
          .from('entry_analyses')
          .upsert({ ...analysis, entry_id: entry.id })

        if (analysisError) throw analysisError

        setCurrentEntry({ ...data, analysis })
      }
    } catch (error) {
      console.error('Error updating entry:', error)
    } finally {
      setIsSaving(false)
    }
  }, [text, currentEntry, entry.id])

  useEffect(() => {
    if (autoSave) {
      const timer = setTimeout(saveEntry, 2000)
      return () => clearTimeout(timer)
    }
  }, [text, autoSave, saveEntry])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full grid grid-cols-1 lg:grid-cols-3 gap-4 relative bg-gray-900 text-white p-4 rounded-lg"
    >
      <div className="lg:col-span-2 relative">
        <div className="absolute right-4 top-4 flex items-center space-x-4 z-10">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoSave}
              onChange={(e) => setAutoSave(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-500"
            />
            <span className="text-sm">Auto-save</span>
          </label>
          <button
            onClick={saveEntry}
            disabled={isSaving || text === currentEntry.content}
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 disabled:opacity-50 text-sm"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
          </button>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-full text-xl p-6 pt-14 bg-gray-800 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="border-l border-gray-700 p-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ background: currentEntry.analysis?.color || '#808080' }}
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
            <p className="text-xl">{currentEntry.analysis?.subject || 'N/A'}</p>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800 p-4 rounded-lg"
          >
            <h3 className="text-lg font-semibold mb-2">Mood</h3>
            <p className="text-xl">{currentEntry.analysis?.mood || 'N/A'}</p>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800 p-4 rounded-lg"
          >
            <h3 className="text-lg font-semibold mb-2">Sentiment</h3>
            <p className="text-xl">
              {currentEntry.analysis?.negative !== undefined
                ? currentEntry.analysis.negative
                  ? 'Negative'
                  : 'Positive'
                : 'N/A'}
            </p>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-800 p-4 rounded-lg"
          >
            <h3 className="text-lg font-semibold mb-2">Summary</h3>
            <p className="text-xl">{currentEntry.analysis?.summary || 'N/A'}</p>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-gray-800 p-4 rounded-lg"
          >
            <h3 className="text-lg font-semibold mb-2">Sentiment Score</h3>
            <p className="text-xl">
              {currentEntry.analysis?.sentiment_score?.toFixed(2) || 'N/A'}
            </p>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6"
          >
            <DeleteConfirmationDialog onDelete={handleDelete} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default Editor
