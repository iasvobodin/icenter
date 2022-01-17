module.exports = async function (context, req, data) {
  // const project = [];
  // data.map(el => el.project);
  // if (errorOut[0]) {
  // }


  const clearData = (el) => {
    const objE = Object.entries(el).filter(
      (entries) => !entries[0].startsWith('_') //&& !entries[0].startsWith('ttl')
    )
    return Object.fromEntries(objE)
  }



  if (data[0]) {
    data.forEach(e => clearData(e))
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
