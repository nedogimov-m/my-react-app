import PropTypes from 'prop-types'

function SearchBar(props) {
  if (import.meta.env.DEV) {
    PropTypes.checkPropTypes(SearchBar.propTypes, props, 'prop', 'SearchBar')
  }

  const { value, onChange } = props

  return (
    <label className="search-bar">
      Поиск по заметкам:
      <input
        type="search"
        placeholder="Введите текст для поиска..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default SearchBar
