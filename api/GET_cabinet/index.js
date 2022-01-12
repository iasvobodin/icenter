module.exports = async function (context, req) {
  // import {clearData} from '../extend.js'

  if (req.query.post) {
    context.bindings.outputWO = req.rawBody
    return
  }

  const clearData = (el) => {
    const objE = Object.entries(el).filter(
      (entries) => !entries[0].startsWith('_') && !entries[0].startsWith('ttl')
    )
    return Object.fromEntries(objE)
  }
  context.res = {
    body: context.bindings.inputWO.map((e) => {
      return clearData(e)
    }),
  }

  // context.bindings.inputWO

  // let wo, cabtime

  // const clearData = (el) => {
  //   const objE = Object.entries(el).filter(
  //     (entries) => !entries[0].startsWith('_') && !entries[0].startsWith('ttl')
  //   )
  //   return Object.fromEntries(objE)
  // }

  // if (!context.bindings.inputWO[0]) {
  //   context.res = {
  //     status: 404,
  //   }
  // } else {
  //   wo = clearData(context.bindings.inputWO[0])
  // }

  // if (!context.bindings.inputCabtime[0]) {
  //   context.res = {
  //     status: 404,
  //   }
  // } else {
  //   cabtime = clearData(context.bindings.inputCabtime[0])
  // }

  // const upadate = {
  //   ...wo,
  //   stats: {
  //     cabTime: cabtime,
  //     time: cabtime.result.final,
  //   },
  // }

  // context.log(wo,"___________________________", cabtime, "_________________________________", upadate)

  // // context.bindings.outputWO = JSON.stringify()
  // context.res = {
  //   body: 'ok',
  // }
}
