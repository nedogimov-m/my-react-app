import { useEffect, useMemo, useState } from 'react'
import NoteForm from './components/NoteForm.jsx'
import NoteList from './components/NoteList.jsx'
import SearchBar from './components/SearchBar.jsx'
import VersionHistory from './components/VersionHistory.jsx'
import { loadNotes, saveNotes } from './lib/storage.js'

function App() {
  const [notes, setNotes] = useState(loadNotes)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [historyId, setHistoryId] = useState(null)

  useEffect(() => {
    saveNotes(notes)
  }, [notes])

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (query === '') return notes
    return notes.filter(
      (note) =>
        note.topic.toLowerCase().includes(query) ||
        note.text.toLowerCase().includes(query)
    )
  }, [notes, search])

  const sortedNotes = useMemo(
    () => [...filteredNotes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [filteredNotes]
  )

  const editingNote = editingId === null
    ? null
    : notes.find((note) => note.id === editingId) ?? null
  const historyNote = historyId === null
    ? null
    : notes.find((note) => note.id === historyId) ?? null

  function handleSave({ topic, text }) {
    const now = new Date().toISOString()

    if (editingNote !== null) {
      setNotes((notes) =>
        notes.map((note) =>
          note.id === editingNote.id
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
      )
      setEditingId(null)
    } else {
      setNotes((notes) => [
        ...notes,
        {
          id: crypto.randomUUID(),
          topic,
          text,
          createdAt: now,
          updatedAt: now,
          versions: [],
        },
      ])
    }
  }

  function handleEdit(note) {
    setEditingId(note.id)
  }

  function handleDelete(id) {
    if (!window.confirm('Удалить заметку?')) return
    setNotes((notes) => notes.filter((note) => note.id !== id))
    if (editingId === id) setEditingId(null)
    if (historyId === id) setHistoryId(null)
  }

  return (
    <div className="app">
      <h1>Заметки</h1>

      <SearchBar value={search} onChange={setSearch} />

      <div className="layout">
        <section className="panel" aria-label="Форма заметки">
          <h2>{editingNote ? 'Редактирование заметки' : 'Новая заметка'}</h2>
          <NoteForm
            key={editingId ?? 'new'}
            initialTopic={editingNote?.topic ?? ''}
            initialText={editingNote?.text ?? ''}
            submitLabel={editingNote ? 'Сохранить изменения' : 'Добавить заметку'}
            onSave={handleSave}
            onCancel={editingNote ? () => setEditingId(null) : null}
          />
        </section>

        <section className="panel" aria-label="Список заметок">
          <h2>Список заметок</h2>
          <NoteList
            notes={sortedNotes}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onShowHistory={setHistoryId}
          />
        </section>
      </div>

      {historyNote && (
        <VersionHistory note={historyNote} onClose={() => setHistoryId(null)} />
      )}
    </div>
  )
}

export default App
