module.exports = async function(context) {
  if (!context.bindings.errorData[0]) {
    context.res = {
      status:  404,
    };
  } else{
    context.res = {
      body:  context.bindings.errorData[0]
    };
  }
  // context.log(context.bindings.errorData[0])

  };
  