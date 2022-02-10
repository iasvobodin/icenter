export function clearData(el) {
  const objE = Object.entries(el).filter(
    (entries) => !entries[0].startsWith('_') && !entries[0].startsWith('ttl')
  )
  return Object.fromEntries(objE)
}
