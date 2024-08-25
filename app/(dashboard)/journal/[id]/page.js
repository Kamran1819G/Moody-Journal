import Editor from '@/components/Editor'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/utils/supabase'

const getEntry = async (id) => {
  const { user } = useAuth

  const { data: entry, error } = await supabase
    .from('journal_entries')
    .select('*, analysis(*)')
    .eq('user_id', user.id)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching entry:', error)
    return null
  }

  return entry
}

const JournalEditorPage = async ({ params }) => {
  const entry = await getEntry(params.id)

  return (
    <div className="w-full h-full">
      <Editor entry={entry} />
    </div>
  )
}

export default JournalEditorPage
