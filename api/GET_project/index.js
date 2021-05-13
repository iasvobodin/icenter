module.exports = async function(context, req, projects) {
  if (projects.length === 0) {
    context.res = {
    status: 404
    };
    return
  }
    context.res = {
      body: projects
    };
  };
  