import { useCallback, useEffect, useRef, useState } from 'react'
import { NoteForm, NoteList, UnsavedChangesDialog, useNotes } from '../features/notes'
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

  const [formState, setFormState] = useState({ dirty: false, canSave: false })
  const formRef = useRef(null)

  const [pendingClose, setPendingClose] = useState(null)

  const handleEdit = useCallback(
    (note) => {
      if (editingNote && note.id !== editingNote.id && formState.dirty) {
        setPendingClose({ type: 'switch', noteId: note.id })
        return
      }
      startEditing(note.id)
    },
    [editingNote, formState.dirty, startEditing]
  )

  const handleCancel = useCallback(() => {
    if (formState.dirty) {
      setPendingClose({ type: 'close' })
      return
    }
    stopEditing()
  }, [formState.dirty, stopEditing])

  const closeHistory = useCallback(() => showHistory(null), [showHistory])

  const handleFormStateChange = useCallback((state) => {
    setFormState((current) =>
      current.dirty === state.dirty && current.canSave === state.canSave ? current : state
    )
  }, [])

  useEffect(() => {
    if (!formState.dirty) return
    const handler = (event) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [formState.dirty])

  const closeDialog = useCallback(() => setPendingClose(null), [])

  const discardChanges = useCallback(() => {
    if (pendingClose?.type === 'switch') startEditing(pendingClose.noteId)
    else stopEditing()
    setPendingClose(null)
  }, [pendingClose, startEditing, stopEditing])

  const saveAndClose = useCallback(() => {
    if (!formState.canSave) return
    formRef.current?.requestSubmit()
    if (pendingClose?.type === 'switch') startEditing(pendingClose.noteId)
    setPendingClose(null)
  }, [formState.canSave, pendingClose, startEditing])

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
            onStateChange={handleFormStateChange}
            formRef={formRef}
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

      {pendingClose && (
        <UnsavedChangesDialog
          onDiscard={discardChanges}
          onSaveAndClose={saveAndClose}
          onCancel={closeDialog}
        />
      )}
    </div>
  )
}

export default App
