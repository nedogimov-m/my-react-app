import PropTypes from 'prop-types'
import { formatDate } from '../lib/storage.js'

function VersionHistory(props) {
  if (import.meta.env.DEV) {
    PropTypes.checkPropTypes(VersionHistory.propTypes, props, 'prop', 'VersionHistory')
  }

  const { note, onClose } = props

  const versions = [
    { topic: note.topic, text: note.text, editedAt: note.updatedAt, isCurrent: true },
    ...[...note.versions].reverse().map((version) => ({ ...version, isCurrent: false })),
  ]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={`История заметки: ${note.topic}`}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="modal-header">
          <h2>История: {note.topic}</h2>
          <button type="button" onClick={onClose} aria-label="Закрыть историю">✕</button>
        </header>
        <ul className="version-list">
          {versions.map((version, index) => (
            <li key={`${version.editedAt}-${index}`}>
              <details open={index === 0}>
                <summary>
                  {version.isCurrent ? 'Текущая версия' : 'Версия'}
                  {' · '}
                  {formatDate(version.editedAt)}
                </summary>
                <div className="version-body">
                  <h4>{version.topic}</h4>
                  <p className="note-text">{version.text}</p>
                </div>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

VersionHistory.propTypes = {
  note: PropTypes.shape({
    topic: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    versions: PropTypes.arrayOf(
      PropTypes.shape({
        topic: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        editedAt: PropTypes.string.isRequired,
      }).isRequired
    ).isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
}

export default VersionHistory
