module.exports = async function (context) {
  if (!context.bindings.errorData[0]) {
    context.res = {
      status: 404,
    }
  } else {
    const item = Object.entries(context.bindings.errorData[0]).filter(
      (entries) => !entries[0].startsWith('_') && !entries[0].startsWith('ttl')
    )
    const objF = Object.fromEntries(item)
    context.res = {
      body: objF,
    }
  }
  // context.log(context.bindings.errorData[0])
}
