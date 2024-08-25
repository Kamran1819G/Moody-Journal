import { motion } from 'framer-motion'
import { Calendar, ThumbsUp } from 'lucide-react'

const EntryCard = ({ entry }) => {
  const date = new Date(entry.createdAt).toDateString()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden rounded-lg bg-gray-800 bg-opacity-50 shadow-lg"
    >
      <div className="px-6 py-4 border-b border-gray-700">
        <div className="flex items-center text-gray-300">
          <Calendar className="w-5 h-5 mr-2" />
          <span>{date}</span>
        </div>
      </div>
      <div className="px-6 py-4">
        <p className="text-gray-300">{entry.analysis.summary}</p>
      </div>
      <div className="px-6 py-4 flex items-center justify-between border-t border-gray-700">
        <div className="flex items-center text-gray-300">
          <ThumbsUp className="w-5 h-5 mr-2" />
          <span>{entry.analysis.mood}</span>
        </div>
      </div>
    </motion.div>
  )
}

export default EntryCard
