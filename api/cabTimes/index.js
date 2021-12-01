module.exports = async function (context, req, data) {
  // const project = [];
  // data.map(el => el.project);
  // if (errorOut[0]) {
  // }

  if (data[0]) {
    context.res = {
      body: data,
      status: 200,
    }
  } else {
    context.res = {
      status: 210,
    }
  }
}
