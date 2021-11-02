module.exports = async function (context, req, tasks) {
  // context.log(tasks)
  context.res = {
    // status: 200, /* Defaults to 200 */
    body: tasks,
  }
}
