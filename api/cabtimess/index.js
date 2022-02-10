module.exports = async function (context, req, data) {

  const clearData = (el) => {
    const objE = Object.entries(el).filter(
      (entries) => !entries[0].startsWith('_') //&& !entries[0].startsWith('ttl')
    )
    return Object.fromEntries(objE)
  }

  if (data.length > 0) {
    data.forEach((e) => clearData(e))
    context.res = {
      body: data,
      status: 200,
    }
  } else {
    context.res = {
      status: 210,
    }
  }
}
