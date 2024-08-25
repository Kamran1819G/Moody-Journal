import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { askQuestion } from '@/utils/api'
import { Send, Loader, AlertCircle } from 'lucide-react'

const Question = () => {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const MAX_CHARS = 280 // Maximum characters allowed for the question

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (question.trim() === '') return

    setLoading(true)
    setError(null)
    try {
      const { data } = await askQuestion(question)
      setAnswer(data)
      setQuestion('')
    } catch (err) {
      setError('Failed to get an answer. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value.slice(0, MAX_CHARS))}
            className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-4 pr-20 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            disabled={loading}
            placeholder="Ask a question..."
            rows={3}
          />
          <span className="absolute bottom-2 right-2 text-sm text-gray-400">
            {question.length}/{MAX_CHARS}
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading || question.trim() === ''}
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-md flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader className="w-6 h-6 animate-spin" />
          ) : (
            <Send className="w-6 h-6" />
          )}
          <span>{loading ? 'Thinking...' : 'Ask'}</span>
        </motion.button>
      </form>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-4 flex items-start space-x-3"
          >
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            <p className="text-red-500">{error}</p>
          </motion.div>
        )}

        {answer && (
          <motion.div
            key="answer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-gray-800 bg-opacity-50 rounded-lg p-6 shadow-lg"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Answer:</h3>
            <p className="text-lg text-gray-300 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Question
