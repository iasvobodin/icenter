module.exports = async function (context, req, tasks) {
  // context.log(tasks)
  if (tasks.length !== 0) {
    const objE = Object.entries(tasks[0]).filter(
      (entries) => !entries[0].startsWith('_')
    )
    const objF = Object.fromEntries(objE)
    context.res = {
      // status: 200, /* Defaults to 200 */
      body: objF,
    }
  } else {
    context.res = {
      status: 404 /* Defaults to 200 */,
      body: 'there are no active tasks',
    }
  }
}
