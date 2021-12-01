module.exports = async function (context, req, connectionInfo) {
  context.res.body = connectionInfo
  // context.res.headers['x-ms-client-principal-id'] = '9c0c1980f5904d10b43e552d2b7c4041'
}
