module.exports = async function (context, req, tasks) {

    const clearData = (el) => {
        const objE = Object.entries(el).filter(
            (entries) => !entries[0].startsWith('_') && !entries[0].startsWith('ttl')
        )
        return Object.fromEntries(objE)
    }

    const clearTasks = tasks.map(e => clearData(e))

    context.res = {
        body: clearTasks,
    }
}