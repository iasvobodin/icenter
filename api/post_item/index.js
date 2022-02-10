module.exports = async function (context, req) {
  context.bindings.errorOut = req.rawBody

  context.res = {
    body: 'item posted'
  }

}
