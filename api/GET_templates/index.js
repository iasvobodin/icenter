module.exports = async function (context, req, data) {
  // var id = context.bindingData;
  // var message = JSON.stringify(context.bindingData);
  //   console.log(message);
  // const project = [];
  // data.forEach(el => {
  //   project.push(el.project);
  // });
  // const set = [...new Set([...project])];

  // const sanitize = data.map( el => {
  const objE = Object.entries(data).filter(
    (entries) => !entries[0].startsWith('_')
  )
  const objF = Object.fromEntries(objE)
  // return objF
  // })

  context.res = {
    body: objF,
  }
  //   context.done();
  //   return {
  //     body: data
  //   };
  //   context.res.body = data;
}
