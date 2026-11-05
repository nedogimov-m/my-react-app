import { useCallback, useState } from 'react'
import { NoteForm, NoteList, useNotes } from '../features/notes'
import { SearchBar } from '../features/search'
import { VersionHistory } from '../features/history'

function App() {
  const [search, setSearch] = useState('')
  const {
    visibleNotes,
    editingNote,
    historyNote,
    saveNote,
    deleteNote,
    startEditing,
    stopEditing,
    showHistory,
  } = useNotes(search)

  const handleEdit = useCallback((note) => startEditing(note.id), [startEditing])
  const handleCancel = useCallback(() => stopEditing(), [stopEditing])
  const closeHistory = useCallback(() => showHistory(null), [showHistory])

  return (
    <div className="app">
      <h1>Заметки</h1>

      <SearchBar value={search} onChange={setSearch} />

      <div className="layout">
        <section className="panel" aria-label="Форма заметки">
          <h2>{editingNote ? 'Редактирование заметки' : 'Новая заметка'}</h2>
          <NoteForm
            key={editingNote?.id ?? 'new'}
            initialTopic={editingNote?.topic ?? ''}
            initialText={editingNote?.text ?? ''}
            submitLabel={editingNote ? 'Сохранить изменения' : 'Добавить заметку'}
            onSave={saveNote}
            onCancel={editingNote ? handleCancel : null}
          />
        </section>

        <section className="panel" aria-label="Список заметок">
          <h2>Список заметок</h2>
          <NoteList
            notes={visibleNotes}
            onEdit={handleEdit}
            onDelete={deleteNote}
            onShowHistory={showHistory}
          />
        </section>
      </div>

      {historyNote && <VersionHistory note={historyNote} onClose={closeHistory} />}
    </div>
  )
}

export default App
