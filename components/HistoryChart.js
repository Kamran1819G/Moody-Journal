'use client'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
  YAxis,
} from 'recharts'
import { motion } from 'framer-motion'

const CustomTooltip = ({ payload, label, active }) => {
  if (active && payload && payload.length) {
    const analysis = payload[0].payload
    const dateLabel = new Date(label).toLocaleString('en-us', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    })

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 custom-tooltip bg-gray-800 bg-opacity-90 shadow-lg border border-gray-700 rounded-lg backdrop-blur-md"
      >
        <div
          className="absolute left-2 top-2 w-3 h-3 rounded-full"
          style={{ background: analysis.color }}
        ></div>
        <p className="text-sm text-gray-400 mb-1">{dateLabel}</p>
        <p className="text-xl font-bold text-white uppercase">
          {analysis.mood}
        </p>
        <p className="text-md text-gray-300">
          Score: {analysis.sentimentScore.toFixed(2)}
        </p>
      </motion.div>
    )
  }
  return null
}

const HistoryChart = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-[300px] bg-gray-800 bg-opacity-50 rounded-lg p-4"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis
            dataKey="updatedAt"
            stroke="#A0AEC0"
            tickFormatter={(tick) => new Date(tick).toLocaleDateString()}
          />
          <YAxis stroke="#A0AEC0" />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="sentimentScore"
            stroke="url(#colorGradient)"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 8, fill: '#8884d8' }}
          />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8884d8" />
              <stop offset="100%" stopColor="#82ca9d" />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

export default HistoryChart
