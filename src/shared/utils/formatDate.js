export function formatDate(isoString) {
  return new Date(isoString).toLocaleString('ru-RU')
}
