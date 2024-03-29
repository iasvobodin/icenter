module.exports = async function (context, req) {
  // import {clearData} from '../extend.js'
  const clearData = (el) => {
    const objE = Object.entries(el).filter(
      (entries) => !entries[0].startsWith('_') && !entries[0].startsWith('ttl')
    )
    return Object.fromEntries(objE)
  }
  if (req.query.wo) {
    const currentWo = context.bindings.inputWO.find(
      (e) => e.wo === req.query.wo
    )
    currentWo['project number'] = currentWo.id
    delete currentWo.id
    context.res = {
      body: currentWo// { info: currentWo }// clearData(currentWo),
    }
    return
  }

  if (req.query.post) {
    context.bindings.outputWO = req.rawBody
    return
  }

  context.res = {
    body: context.bindings.inputWO.map((e) => {
      e['project number'] = e.id
      return { info: e }
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
