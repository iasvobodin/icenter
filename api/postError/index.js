module.exports = async function(context, req) {
  context.log(context.req.body);

  context.bindings.erorData = {
    id: context.req.body.id,
    data: context.req.body.data
  };
  context.res = {
    // status: 200, /* Defaults to 200 */
    body: "responseMessage"
  };
};
