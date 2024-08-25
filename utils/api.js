const createURL = (path) => window.location.origin + path

export const fetcher = (...args) => fetch(...args).then((res) => res.json())

export const deleteEntry = async (id) => {
  const res = await fetch(
    new Request(createURL(`/api/entry/${id}`), {
      method: 'DELETE',
    })
  )
  if (res.ok) {
    return res.json()
  } else {
    throw new Error(`Failed to delete entry: ${res.status} ${res.statusText}`)
  }
}

export const newEntry = async (content = 'new entry') => {
  const res = await fetch(
    new Request(createURL('/api/entry'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    })
  )
  if (res.ok) {
    return res.json()
  } else {
    throw new Error(
      `Failed to create new entry: ${res.status} ${res.statusText}`
    )
  }
}

export const updateEntry = async (id, updates) => {
  const res = await fetch(
    new Request(createURL(`/api/entry/${id}`), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ updates }),
    })
  )
  if (res.ok) {
    return res.json()
  } else {
    throw new Error(`Failed to update entry: ${res.status} ${res.statusText}`)
  }
}

export const askQuestion = async (question) => {
  const res = await fetch(
    new Request(createURL(`/api/question`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    })
  )
  if (res.ok) {
    return res.json()
  } else {
    throw new Error(`Failed to ask question: ${res.status} ${res.statusText}`)
  }
}
