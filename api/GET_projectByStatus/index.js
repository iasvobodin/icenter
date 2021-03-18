module.exports = async function(context, req, data) {
  const project = [];
  data.forEach(el => {
    if (el.id.endsWith(".0")) {
      let modifyEl = el.id.slice(0, -2);
      project.push(modifyEl);
    } else {
      project.push(el.id);
    }
  });
  context.res = {
    body: project.sort()
  };
};
