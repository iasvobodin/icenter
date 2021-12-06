// const {
//   Client
// } = require("@microsoft/microsoft-graph-client");
// const {
//   TokenCredentialAuthenticationProvider
// } = require("@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials");
// const {
//   DeviceCodeCredential
// } = require("@azure/identity");

// const credential = new DeviceCodeCredential(tenantId, clientId, clientSecret);
// const authProvider = new TokenCredentialAuthenticationProvider(credential, {
//   scopes: [scopes]
// });

// const client = Client.initWithMiddleware({
//   debugLogging: true,
//   authProvider
//   // Use the authProvider object to create the class.
// });

module.exports = async function (context, req) {
  context.bindings.signalRMessages = [
    {
      target: 'newMessage',
      arguments: [req.body],
    },
  ]
  context.log(req.body)
  // const header = req.headers['x-ms-client-principal'];
  // const encoded = Buffer.from(header, 'base64');
  // const decoded = encoded.toString('ascii');

  context.res = {
    body: {
      headers: req.headers,
    },
  }
}
