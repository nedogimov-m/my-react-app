import PropTypes from 'prop-types'

function UnsavedChangesDialog(props) {
  if (import.meta.env.DEV) {
    PropTypes.checkPropTypes(UnsavedChangesDialog.propTypes, props, 'prop', 'UnsavedChangesDialog')
  }

  const { onDiscard, onSaveAndClose, onCancel } = props

  return (
    <div className="modal-overlay">
      <div
        className="modal"
        role="alertdialog"
        aria-modal="true"
        aria-label="Предупреждение о несохранённых изменениях"
      >
        <p>У вас есть несохраненные изменения. Закрыть?</p>
        <div className="form-actions">
          <button type="button" className="primary" onClick={onDiscard}>ОК</button>
          <button type="button" onClick={onSaveAndClose}>Сохранить и закрыть</button>
          <button type="button" onClick={onCancel}>Отменить</button>
        </div>
      </div>
    </div>
  )
}

UnsavedChangesDialog.propTypes = {
  onDiscard: PropTypes.func.isRequired,
  onSaveAndClose: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}

export default UnsavedChangesDialog
