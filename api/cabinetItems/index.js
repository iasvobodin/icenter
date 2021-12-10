module.exports = async function (context, req, cabinetItems) {
  if (req.query.cabtime) {
    context.res = {
      body: cabinetItems,
    }
    return
  }
  const clearData = (el) => {
    const objE = Object.entries(el).filter(
      (entries) => !entries[0].startsWith('_') && !entries[0].startsWith('ttl')
    )
    return Object.fromEntries(objE)
  }
const filterArr = cabinetItems.filter((e)=> e.type.includes('error')).map(e => clearData(e))

  const changeStatus = filterArr.map((e) => {
    // if (e.type.includes('error')) {
      const fStatus = e.body.filter((f) => f.Принято)[0]
      return {
        _time: fStatus._time,
        _changed: fStatus._changed,
      }
    // }
  })
  // context.log(changeStatus)
  const bodyMap = filterArr.map((e, i) => {
    delete e.info
    // if (e.type.includes('error')) {
      return {
        ...e,
        body: e.body[e.body.length - 1],
        _ts: e.body[0]._time,
        confirmedTime: changeStatus[i]._time,
        confirmedChanged: changeStatus[i]._changed,
      }
    // } else {
      // return //e
    // }
  })

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: bodyMap,
  }
}
