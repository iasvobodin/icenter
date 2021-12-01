module.exports = async function (context, req, legendStat, projects) {
  if (legendStat.length === 0) {
    context.res = {
      status: 404,
    }
    return
  }
  const transformData = legendStat.map((el) => {
    const objE = Object.entries(el).filter(
      (entries) => !entries[0].startsWith('_') && !entries[0].startsWith('ttl')
    )
    const objF = Object.fromEntries(objE)
    const cabinets = []
    el.Cabinets.split(',').forEach((e) =>
      cabinets.push({
        wo: e.split('__')[0],
        'cab name': e.split('__')[1],
      })
    )
    return {
      ...objF,
      cabinets,
    }
  })
  if (req.query.mergeProjects) {
    const existProjects = Object.values(projects).map((e) =>
      e.id.includes(',') ? e.id.replace(',', '.') : e.id
    )
    const mergeProjects = transformData.filter(
      (e) => !existProjects.includes(e.id)
    )

    context.res = {
      body: {
        data: mergeProjects,
        lastUpdate: legendStat[legendStat.length - 1]._ts,
      },
    }
    return
  }

  if (req.query.updateWO) {
    const newWO = transformData.find((e) => e.id === req.query.project)
    context.log(typeof newWO, newWO)
    context.res = {
      body: newWO,
    }
    return
  }
  context.res = {
    body: {
      data: transformData,
      lastUpdate: legendStat[legendStat.length - 1]._ts,
    },
  }
  // const fProject = {
  //   project: data[0].project,
  //   cabinets: []
  // }
  // data.forEach(e => {
  //   e.cabinet.wo&&fProject.cabinets.push(e.cabinet)
  // })
}
