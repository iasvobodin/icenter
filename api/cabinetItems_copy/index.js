module.exports = async function (context, req, cabinetItems) {
  const clearData = (el) => {
    const objE = Object.entries(el).filter(
      (entries) => !entries[0].startsWith('_') //&& !entries[0].startsWith('ttl')
    )
    return Object.fromEntries(objE)
  }
  const cabtime = clearData(cabinetItems.find((e) => (e.type = 'cabtime')))

  if (req.query.cabtime) {
    // const cabtime = cabinetItems.find((e) => e.type = 'cabtime')
    if (cabtime) {
      context.res = {
        body: cabtime,
      }
    }

    return
  }

  const modifiedError = cabinetItems
    .filter((e) => e.type.includes('error'))
    .map((el, i) => {
      const e = clearData(el)
      const opened = e.body[0]
      const confirmed = e.body.find((f) => Object.values(f.Принято).length > 0) //FIRST NOT EMPTY OBJECT
      const closed = e.body.find((f) => Object.values(f.Устранено).length > 0) //FIRST NOT EMPTY OBJECT

      const history = {
        opened: {
          _changed: opened._changed,
          _time: opened._time,
        },
        confirmed: {
          _changed: confirmed._changed || '',
          _time: confirmed._time || '',
        },
        closed: {
          _changed: closed._changed || '',
          _time: closed._time || '',
        },
      }
      // delete e.info
      // if (e.type.includes('error')) {
      return {
        ...e,
        status: e.info.status,
        body: clearData(e.body[e.body.length - 1]),
        // _ts: e.body[0]._time,
        history,
        // confirmedTime: changeStatus[i]?._time,
        // confirmedChanged: changeStatus[i]?._changed,
      }
      // } else {
      // return //e
      // }
    })
  context.log([...modifiedError, cabtime])
  context.res = {
    // status: 200, /* Defaults to 200 */
    body: [...modifiedError, cabtime],
  }
}
