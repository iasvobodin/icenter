module.exports = async function (context, req, projects, updateProject) {
  if (req.query.updateProject) {
    context.bindings.updateProject = req.rawBody
    return
  }
  if (projects.length === 0) {
    context.res = {
      status: 404,
    }
    return
  }
  if (projects.length > 0 && req.query.project) {
    const currentProject = projects.find((e) => e.id === req.query.project)
    context.res = {
      body: currentProject,
    }
    return
  }

  
  const sanitize = projects.map( el => {
    const objE = Object.entries(el).filter(entries => !entries[0].startsWith('_'))
    const objF = Object.fromEntries(objE)
    return objF
  })


  context.res = {
    body: sanitize,
  }
}
