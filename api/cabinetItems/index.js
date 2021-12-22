module.exports = async function (context, req, cabinetItems) {
  if (req.query.cabtime) {
    context.res = {
      body: cabinetItems,
    }
    return
  }
  const clearData = (el) => {
    const objE = Object.entries(el).filter(
      (entries) => !entries[0].startsWith('_') //&& !entries[0].startsWith('ttl')
    )
    return Object.fromEntries(objE)
  }
  // const filterArr = cabinetItems
  //   .filter((e) => e.type.includes('error'))
  //   .map((e) => clearData(e))

  // const changeStatus = filterArr.map((e) => {
  //   // if (e.type.includes('error')) {
  //   const fStatus = e.body.filter(
  //     (f) => !e.info.status === 'open' && f.Принято['Статус решения']
  //   )[0]
  //   return {
  //     _time: fStatus?._time,
  //     _changed: fStatus?._changed,
  //   }
  //   // }
  // })

  // const createErrorHistory = (errorArray) => {
  //   const mapped = errorArray.map((e) => {
  //     const opened = e.body[0]
  //     const confirmed = e.body.find((f) => Object.values(f.Принято).length > 0)
  //     const closed = e.body.find((f) => Object.values(f.Устранено).length > 0) //f.Устранено['Статус коррекции'])
  //     // context.log(opened, 'OPENED')
  //     // context.log(confirmed, 'CONFIRMED')
  //     // context.log(closed, 'CLOSED')
  //     return {
  //       opened: {
  //         _changed: opened._changed,
  //         _time: opened._time,
  //       },
  //       confirmed: {
  //         _changed: confirmed?._changed || null,
  //         _time: confirmed?._time || null,
  //       },
  //       closed: {
  //         _changed: closed?._changed || null,
  //         _time: closed?._time || null,
  //       },
  //     }
  //   })
  //   return mapped
  // }
  // context.log(createErrorHistory(filterArr), 'tada')

  // context.log(changeStatus)
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
          _changed: confirmed?._changed || '',
          _time: confirmed?._time || '',
        },
        closed: {
          _changed: closed?._changed || '',
          _time: closed?._time || '',
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

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: modifiedError,
  }
}
