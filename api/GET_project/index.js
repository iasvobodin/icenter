module.exports = async function(context, req, projects) {
    context.res = {
      body: projects
    };
  };
  