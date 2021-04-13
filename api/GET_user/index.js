module.exports = async function (context, req, user) {
  if (context.bindings.userErors[0]) {
    context.res = {
      status: 200,
      body: context.bindings.userErors,
    };
    return;
  } 
  // else {
  //   context.res = {
  //     status: 404,
  //   };
  // }
  // context.log(context.bindings.userOut)
  if (!user[0]) {
    context.res = {
      body: req.body,
    };
    return (context.bindings.userPost = req.body);
  } else {
    context.res = {
      body: user[0],
    };
  }
};
