module.exports = async function(context, req, user) {
  if (!user[0]) {
    context.log("user in not def");
    context.log(req, "request data from app");
    context.res = {
        body: req.body
    };
    return context.bindings.userPost = req.body;
  } else {
    context.res = {
      body: user
    };
  }
  // context.log(user)
};
