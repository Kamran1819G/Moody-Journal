export const analyzeEntry = async (entry) => {
  try {
    const response = await fetch('/api/analyze-entry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: entry.content }),
    })

    if (!response.ok) {
      throw new Error('Failed to analyze entry')
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to analyze entry:', error)
    return null
  }
}

export const askQuestion = async (question, entries) => {
  try {
    const response = await fetch('/api/ask-question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, entries }),
    })

    if (!response.ok) {
      throw new Error('Failed to process question')
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to process question:', error)
    return null
  }
}
