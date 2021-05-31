module.exports = async function (context, req, cabinetItems) {

   const bodyMap = cabinetItems.map(e => {
      return {
           ...e, 
          body: e.body[e.body.length - 1]
        }
   }
   )

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: bodyMap
    };
}