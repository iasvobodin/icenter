module.exports = async function (context, req) {
  context.log(context.req.body)

  context.bindings.projectOut = context.req.body
  // {
  //   id: context.req.body.id,
  //   status: context.req.body.status,
  //   info: context.req.body.info,
  //   info: context.req.body.info,
  //   cabinets: context.req.body.cabinets
  // };
  context.res = {
    // status: 200, /* Defaults to 200 */
    body: 'responseMessage',
  }
}
