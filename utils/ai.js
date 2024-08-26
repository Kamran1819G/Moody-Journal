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

const getPrompt = (content) => {
  return `Analyze the following journal entry. Follow the instructions and format your response to match the format instructions, no matter what!

Output should be a valid JSON object with the following schema:
${JSON.stringify(outputSchema.shape, null, 2)}

Journal entry:
${content}`
}

export const analyzeEntry = async (entry) => {
  const prompt = getPrompt(entry.content)

  const chatCompletion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0,
  })

  const output = chatCompletion.choices[0].message.content

  try {
    return outputSchema.parse(JSON.parse(output))
  } catch (e) {
    console.error('Failed to parse output:', e)
    throw new Error('Failed to analyze entry')
  }
}

export const qa = async (question, entries) => {
  const context = entries
    .map((entry) => `Entry ${entry.id} (${entry.createdAt}): ${entry.content}`)
    .join('\n\n')

  const prompt = `Context:
${context}

Question: ${question}

Please answer the question based on the context provided above.`

  const chatCompletion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0,
  })

  return chatCompletion.choices[0].message.content
}
