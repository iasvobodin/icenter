module.exports = async function(context, req, data) {
  const fProject = {
    project: data[0].project,
    cabinets: []
  }
  data.forEach(e => {
    e.cabinet.wo&&fProject.cabinets.push(e.cabinet)
  })
  context.res = {
    body: fProject
  };
};
