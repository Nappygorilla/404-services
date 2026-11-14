import { NOT_CONNECTED, supabase } from './supabase'

export type Board = 'announcements' | 'issues'

export type Thread = {
  id: string
  board: Board
  title: string
  body: string
  author_id: string
  author_name: string
  created_at: string
}

type ListResult = { threads: Thread[]; error?: string }
type CreateResult = { error?: string }

const COLUMNS = 'id, board, title, body, author_id, author_name, created_at'

export async function listThreads(board: Board): Promise<ListResult> {
  if (!supabase) return { threads: [], error: NOT_CONNECTED }
  const { data, error } = await supabase
    .from('forum_threads')
    .select(COLUMNS)
    .eq('board', board)
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) return { threads: [], error: 'Could not load this board. Try again in a moment.' }
  return { threads: (data ?? []) as Thread[] }
}

export async function removeThread(id: string): Promise<CreateResult> {
  if (!supabase) return { error: NOT_CONNECTED }
  const { error } = await supabase.from('forum_threads').delete().eq('id', id)
  if (error) return { error: 'The topic could not be removed.' }
  return {}
}

export async function createThread(input: { board: Board; title: string; body: string; authorId: string; authorName: string }): Promise<CreateResult> {
  if (!supabase) return { error: NOT_CONNECTED }
  const title = input.title.trim()
  const body = input.body.trim()
  if (title.length < 4) return { error: 'Give the topic a title of at least 4 characters.' }
  if (title.length > 120) return { error: 'Keep the title under 120 characters.' }
  if (body.length < 10) return { error: 'Add a little more detail — at least 10 characters.' }
  if (body.length > 4000) return { error: 'Keep the post under 4000 characters.' }

  const { error } = await supabase.from('forum_threads').insert({
    board: input.board,
    title,
    body,
    author_id: input.authorId,
    author_name: input.authorName.slice(0, 60),
  })
  if (error) {
    if (error.code === '42501') return { error: 'Your account is not allowed to post to this board.' }
    return { error: 'The post did not save. Try again in a moment.' }
  }
  return {}
}
