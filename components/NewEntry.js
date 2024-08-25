import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { newEntry } from '@/utils/api'
import { PlusCircle } from 'lucide-react'

const NewEntry = () => {
  const router = useRouter()

  const handleOnClick = async () => {
    const { data } = await newEntry()
    router.push(`/journal/${data.id}`)
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
