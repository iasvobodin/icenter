module.exports = async function(context, req, data) {
  // const project = [];
  // data.map(el => el.project);
  context.res = {
    body:  data.map(el => el.project.toString()).filter(el => el.length > 6).sort()
  };
};
