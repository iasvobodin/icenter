module.exports = async function (context, req, inputWo) {
  const clearData = (el) => {
    const objE = Object.entries(el).filter(
      (entries) => !entries[0].startsWith('_') && !entries[0].startsWith('ttl')
    )
    return Object.fromEntries(objE)
  }
  context.res = {
    // status: 200, /* Defaults to 200 */
    body: clearData(inputWo[0]),
  }
}
