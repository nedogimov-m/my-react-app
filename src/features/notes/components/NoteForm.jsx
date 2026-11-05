import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

function NoteForm(props) {
  if (import.meta.env.DEV) {
    PropTypes.checkPropTypes(NoteForm.propTypes, props, 'prop', 'NoteForm')
  }

  const { initialTopic, initialText, submitLabel, onSave, onCancel, onStateChange, formRef } = props
  const [topic, setTopic] = useState(initialTopic)
  const [text, setText] = useState(initialText)
  const [error, setError] = useState('')
  const formElementRef = useRef(null)

  useEffect(() => {
    if (!formRef) return
    formRef.current = {
      requestSubmit: () => formElementRef.current?.requestSubmit(),
    }
  }, [formRef])

  const trimmedTopic = topic.trim()
  const trimmedText = text.trim()
  const dirty = trimmedTopic !== initialTopic.trim() || trimmedText !== initialText.trim()
  const canSave = trimmedTopic !== '' && trimmedText !== ''

  useEffect(() => {
    onStateChange?.({ dirty, canSave })
  }, [dirty, canSave, onStateChange])

  function handleSubmit(event) {
    event.preventDefault()

    if (topic.trim() === '') {
      setError('Введите тему заметки')
      return
    }
    if (text.trim() === '') {
      setError('Введите текст заметки')
      return
    }

    setError('')
    onSave({ topic: topic.trim(), text: text.trim() })
    setTopic('')
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} ref={formElementRef} noValidate>
      <p>
        <label>
          Тема:
          <input
            type="text"
            placeholder="Название заметки"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            required
          />
        </label>
      </p>
      <p>
        <label>
          Текст заметки:
          <textarea
            rows={6}
            placeholder="Текст заметки"
            value={text}
            onChange={(event) => setText(event.target.value)}
            required
          />
        </label>
      </p>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="form-actions">
        <button type="submit" className="primary">{submitLabel}</button>
        {onCancel && (
          <button type="button" onClick={onCancel}>Отмена</button>
        )}
      </div>
    </form>
  )
}

NoteForm.propTypes = {
  initialTopic: PropTypes.string.isRequired,
  initialText: PropTypes.string.isRequired,
  submitLabel: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  onStateChange: PropTypes.func,
  formRef: PropTypes.shape({ current: PropTypes.any }),
}

export default NoteForm
