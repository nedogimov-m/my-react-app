import { useCallback, useEffect, useMemo, useState } from 'react'
import { loadNotes, saveNotes } from '../../../shared/lib/storage.js'

export function useNotes(searchQuery) {
  const [notes, setNotes] = useState(loadNotes)
  const [editingId, setEditingId] = useState(null)
  const [historyId, setHistoryId] = useState(null)

  useEffect(() => {
    saveNotes(notes)
  }, [notes])

  const visibleNotes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    const filtered =
      query === ''
        ? notes
        : notes.filter(
            (note) =>
              note.topic.toLowerCase().includes(query) ||
              note.text.toLowerCase().includes(query)
          )
    return [...filtered].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  }, [notes, searchQuery])

  const editingNote = useMemo(
    () => (editingId === null ? null : notes.find((note) => note.id === editingId) ?? null),
    [notes, editingId]
  )

  const historyNote = useMemo(
    () => (historyId === null ? null : notes.find((note) => note.id === historyId) ?? null),
    [notes, historyId]
  )

  const saveNote = useCallback(
    ({ topic, text }) => {
      const now = new Date().toISOString()

      setNotes((currentNotes) => {
        if (editingId === null) {
          return [
            ...currentNotes,
            {
              id: crypto.randomUUID(),
              topic,
              text,
              createdAt: now,
              updatedAt: now,
              versions: [],
            },
          ]
        }

        return currentNotes.map((note) =>
          note.id === editingId
            ? {
                ...note,
                versions: [
                  ...note.versions,
                  { topic: note.topic, text: note.text, editedAt: note.updatedAt },
                ],
                topic,
                text,
                updatedAt: now,
              }
            : note
        )
      })

      setEditingId(null)
    },
    [editingId]
  )

  const deleteNote = useCallback(
    (id) => {
      if (!window.confirm('Удалить заметку?')) return
      setNotes((currentNotes) => currentNotes.filter((note) => note.id !== id))
      setEditingId((current) => (current === id ? null : current))
      setHistoryId((current) => (current === id ? null : current))
    },
    []
  )

  const showHistory = useCallback((id) => {
    setHistoryId(id)
  }, [])

  return {
    visibleNotes,
    editingNote,
    historyNote,
    saveNote,
    deleteNote,
    startEditing: setEditingId,
    stopEditing: useCallback(() => setEditingId(null), []),
    showHistory,
  }
}
