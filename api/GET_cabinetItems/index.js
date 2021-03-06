module.exports = async function (context, req, cabinetItems) {
const changeStatus = cabinetItems.map(e => {
   const fStatus = e.body.filter(f=> f.Принято)[0]
   return {
       _time: fStatus._time,
       _changed:fStatus._changed
   }
})
context.log(changeStatus)
   const bodyMap = cabinetItems.map((e,i) => {
      return {
           ...e, 
          body: e.body[e.body.length - 1],
          _ts: e.body[0]._time,
          confirmedTime: changeStatus[i]._time,
          confirmedChanged: changeStatus[i]._changed
        }
   }
   )

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: bodyMap
    };
}