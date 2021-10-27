module.exports = async function (context, req) {
  context.bindings.signalRMessages = [{
    "target": "newMessage",
    "arguments": [ req.body ]
}];
  // const header = req.headers['x-ms-client-principal'];
  // const encoded = Buffer.from(header, 'base64');
  // const decoded = encoded.toString('ascii');

  // context.res = {
  //   body: {
  //     headers: req.headers,
  //   },
  // }
}
