module.exports = async function(context, req, data) {
  // const project = [];
  // data.map(el => el.project);
  context.res = {
    body:  {
      data: data.map(el => el.project.toString()).filter(el => el.length > 6).sort(),
lastUpdate: data[data.length - 1]._ts    
    }
  };
};
