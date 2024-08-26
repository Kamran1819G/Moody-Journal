import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { content } = req.body

  try {
    const context = content.entries
      .map(
        (entry) => `Entry ${entry.id} (${entry.createdAt}): ${entry.content}`
      )
      .join('\n\n')

    const prompt = `Context: ${context} Question: ${question} Please answer the question based on the context provided above.`
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0,
    })
    res.status(200).json(chatCompletion.choices[0].message.content)
  } catch (error) {
    console.error('Failed to process question:', e)
    res.status(500).json('An error occurred while processing your question.')
  }
}
