const STORAGE_KEY = 'notes'

function isNote(value) {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.id === 'string' &&
    typeof value.topic === 'string' &&
    typeof value.text === 'string' &&
    typeof value.createdAt === 'string' &&
    typeof value.updatedAt === 'string' &&
    Array.isArray(value.versions)
  )
}

export function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isNote)
  } catch {
    return []
  }
}

export function saveNotes(notes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  } catch {
    // localStorage может быть недоступен или переполнен — не роняем приложение
  }
}

export function formatDate(isoString) {
  return new Date(isoString).toLocaleString('ru-RU')
}
