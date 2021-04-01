module.exports = async function(context, req) {
  context.log(context.req.body);

  context.bindings.projectOut = context.req.body;

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: "responseMessage"
  };
};
