export default function searchByObject(obj, key, query) {
  return obj.filter((el) => {
    key.some((key) => {
      el[key].includes(query)
    })
  })
}
