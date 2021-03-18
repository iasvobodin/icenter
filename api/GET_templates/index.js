module.exports = async function(context, req, data) {
    // var id = context.bindingData;
    // var message = JSON.stringify(context.bindingData);
    //   console.log(message);
    // const project = [];
    // data.forEach(el => {
    //   project.push(el.project);
    // });
    // const set = [...new Set([...project])];
    context.res = {
      body: data
    };
    //   context.done();
    //   return {
    //     body: data
    //   };
    //   context.res.body = data;
  };