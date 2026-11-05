import { memo } from 'react'
import PropTypes from 'prop-types'
import { formatDate } from '../../../shared/utils/formatDate.js'

function NoteCard(props) {
  if (import.meta.env.DEV) {
    PropTypes.checkPropTypes(NoteCard.propTypes, props, 'prop', 'NoteCard')
  }

  const { note, onEdit, onDelete, onShowHistory } = props

  return (
    <article className="note-card">
      <h3>{note.topic}</h3>
      <p className="note-text">{note.text}</p>
      <p className="note-dates">
        Создана: {formatDate(note.createdAt)}<br />
        Отредактирована: {formatDate(note.updatedAt)}
      </p>
      <div className="note-actions">
        <button type="button" onClick={() => onEdit(note)}>Редактировать</button>
        <button type="button" onClick={() => onShowHistory(note.id)}>
          История ({note.versions.length})
        </button>
        <button type="button" className="danger" onClick={() => onDelete(note.id)}>
          Удалить
        </button>
      </div>
    </article>
  )
}

const versionShape = PropTypes.shape({
  topic: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  editedAt: PropTypes.string.isRequired,
})

NoteCard.propTypes = {
  note: PropTypes.shape({
    id: PropTypes.string.isRequired,
    topic: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    versions: PropTypes.arrayOf(versionShape.isRequired).isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onShowHistory: PropTypes.func.isRequired,
}

export default memo(NoteCard)
