module.exports = async function(context, req) {
  context.log(context.bindings);

  context.bindings.projectOut = req.rawBody

  // context.done();
};
