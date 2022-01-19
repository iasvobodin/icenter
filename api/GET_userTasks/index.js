module.exports = async function (context, req, tasks) {
  // context.log(Array.isArray(tasks), 'test array')

  const clearData = (el) => {
    const objE = Object.entries(el).filter(
      (entries) => !entries[0].startsWith('_') //&& !entries[0].startsWith('ttl')
    )
    return Object.fromEntries(objE)
  }
  //active task
  if (req.query.user) {
    const task = tasks.find(e => e.status === 'active')

    if (task) {
      context.res = {
        body: clearData(task),
      }
    } else {
      context.res = {
        status: 404 /* Defaults to 200 */,
        body: 'there are no active tasks',
      }
    }
  }
  if (req.query.all) {
    tasks.forEach(e => clearData(e))
    context.res = {
      body: tasks,
    }
  }

}
