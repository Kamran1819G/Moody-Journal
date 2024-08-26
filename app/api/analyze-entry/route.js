import OpenAI from 'openai'
import { z } from 'zod'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const outputSchema = z.object({
  mood: z
    .string()
    .describe('the mood of the person who wrote the journal entry.'),
  subject: z.string().describe('the subject of the journal entry.'),
  negative: z
    .boolean()
    .describe(
      'is the journal entry negative? (i.e. does it contain negative emotions?).'
    ),
  summary: z.string().describe('quick summary of the entire entry.'),
  color: z
    .string()
    .describe(
      'a hexadecimal color code that represents the mood of the entry. Example #0101fe for blue representing happiness.'
    ),
  sentimentScore: z
    .number()
    .describe(
      'sentiment of the text and rated on a scale from -10 to 10, where -10 is extremely negative, 0 is neutral, and 10 is extremely positive.'
    ),
})

export async function POST(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { content } = req.body

  try {
    const prompt = `Analyze the following journal entry...` // Your prompt creation logic

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0,
    })

    const output = chatCompletion.choices[0].message.content
    const parsedOutput = outputSchema.parse(JSON.parse(output))

    res.status(200).json(parsedOutput)
  } catch (error) {
    console.error('Failed to analyze entry:', error)
    res.status(500).json({ message: 'Failed to analyze entry' })
  }
}
