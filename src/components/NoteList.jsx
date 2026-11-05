import PropTypes from 'prop-types'
import NoteCard from './NoteCard.jsx'

function NoteList(props) {
  if (import.meta.env.DEV) {
    PropTypes.checkPropTypes(NoteList.propTypes, props, 'prop', 'NoteList')
  }

  const { notes, onEdit, onDelete, onShowHistory } = props

  if (notes.length === 0) {
    return <p className="empty">Заметки не найдены</p>
  }

  return (
    <ul className="note-list">
      {notes.map((note) => (
        <li key={note.id}>
          <NoteCard
            note={note}
            onEdit={onEdit}
            onDelete={onDelete}
            onShowHistory={onShowHistory}
          />
        </li>
      ))}
    </ul>
  )
}

const noteShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  topic: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
  versions: PropTypes.array.isRequired,
})

NoteList.propTypes = {
  notes: PropTypes.arrayOf(noteShape.isRequired).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onShowHistory: PropTypes.func.isRequired,
}

export default NoteList
