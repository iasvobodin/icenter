module.exports = async function (context, req) {
  context.bindings.icenterCabinets = req.rawBody
  context.res = {
    // status: 200, /* Defaults to 200 */
    body: 'ok',
  }
}
