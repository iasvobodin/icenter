module.exports = async function (context, req, cabinetItems) {
  const clearData = (el) => {
    const objE = Object.entries(el).filter(
      (entries) => !entries[0].startsWith('_') //&& !entries[0].startsWith('ttl')
    )
    return Object.fromEntries(objE)
  }

  if (cabinetItems.length > 0) {
    const cabinetItemsClear =
      cabinetItems.map((el, i) => clearData(el))
    context.res = {
      // status: 200, /* Defaults to 200 */
      body: cabinetItemsClear,
    }
  }
}
