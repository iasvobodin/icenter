module.exports = async function(context, req, user) {
  if (!user[0]) {
    context.res = {
        body: req.body
    };
    return context.bindings.userPost = req.body;
  } else {
    context.res = {
      body: user
    };
  }
};
