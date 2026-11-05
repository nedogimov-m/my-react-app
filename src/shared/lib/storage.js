const STORAGE_KEY = 'notes'
const MAX_TEXT_LENGTH = 10_000
const MAX_VERSIONS = 1000

function isPlainObject(value) {
  return (
    typeof value === 'object' &&
    value !== null &&
    (Object.getPrototypeOf(value) === Object.prototype ||
      Object.getPrototypeOf(value) === null)
  )
}

function pickStringFields(source, fields) {
  const result = {}
  for (const field of fields) {
    const value = source[field]
    if (typeof value !== 'string') return null
    result[field] = value.length > MAX_TEXT_LENGTH ? value.slice(0, MAX_TEXT_LENGTH) : value
  }
  return result
}

function sanitizeVersion(value) {
  if (!isPlainObject(value)) return null
  return pickStringFields(value, ['topic', 'text', 'editedAt'])
}

function sanitizeNote(value) {
  if (!isPlainObject(value)) return null
  const strings = pickStringFields(value, ['id', 'topic', 'text', 'createdAt', 'updatedAt'])
  if (strings === null) return null
  if (!Array.isArray(value.versions)) return null

  const versions = []
  for (const entry of value.versions.slice(0, MAX_VERSIONS)) {
    const version = sanitizeVersion(entry)
    if (version === null) return null
    versions.push(version)
  }

  return { ...strings, versions }
}

export function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map(sanitizeNote).filter((note) => note !== null)
  } catch {
    return []
  }
}

export function saveNotes(notes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  } catch {}
}
