module.exports = async function (context) {

  const clearData = (el) => {
    const objE = Object.entries(el).filter(
      (entries) => !entries[0].startsWith('_')
    )
    return Object.fromEntries(objE)
  }

  if (!context.bindings.errorData[0]) {
    context.res = {
      status: 404,
    }
  } else {
    context.res = {
      body: clearData(context.bindings.errorData[0]),
    }
  }
  // context.log(context.bindings.errorData[0])
}
