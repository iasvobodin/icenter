module.exports = async function (context, req) {
    context.bindings.userErrorOut = req.rawBody
}