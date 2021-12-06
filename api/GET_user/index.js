module.exports = async function (context, req, user) {
  if (req.query.getRegisterUser) {
    const objE = Object.entries(user[0]).filter(
      (entries) => !entries[0].startsWith('_')
    )
    const objF = Object.fromEntries(objE)
    if (user.length != 0) {
      context.res = {
        status: 200,
        body: objF,
      }
    } else {
      context.res = {
        status: 404,
      }
    }

    return
  }

  if (req.query.postRegisterUser) {
    context.res = {
      status: 200,
      body: req.body,
    }
    return (context.bindings.userPost = req.body)
    // return
  }

  if (context.bindings.userErors[0]) {
    context.res = {
      status: 200,
      body: context.bindings.userErors,
    }
    return
  }
  // else {
  //   context.res = {
  //     status: 404,
  //   };
  // }
  // context.log(context.bindings.userOut)
  if (!user[0]) {
    context.res = {
      status: 404,
      // body: user[0],
    }
    return (context.bindings.userPost = req.body)
  } else {
    context.res = {
      status: 200,
      body: user[0],
    }
    // return
    // return (context.bindings.userPost = req.body);
  }

  // if (!user[0]) {
  //   context.res = {
  //     body: req.body,
  //   };
  //   return (context.bindings.userPost = req.body);
  // } else {
  //   context.res = {
  //     body: user[0],
  //   };
  // }
}
