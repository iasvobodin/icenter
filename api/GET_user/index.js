module.exports = async function(context, req, user) {
  if (context.bindings.userOut[0]) {
    context.res = {
      body: context.bindings.userOut
    };
    return
  }
  context.log(context.bindings.userOut)
  if (!user[0]) {
    context.res = {
      body: req.body
    };
    return (context.bindings.userPost = req.body);
  } else {
    context.res = {
      body: user
    };
  }
};
