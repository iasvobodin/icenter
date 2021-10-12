module.exports = async function (context, req, user) {
  context.log(context.req)
  context.res = {
    // status: 200, /* Defaults to 200 */
    body: user,
  }
}
