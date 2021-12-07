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

var axios = require('axios');
var qs = require('qs');

const testFetch = async (id, secret,code,redirect) =>{



  var data = qs.stringify({
    'grant_type': 'authorization_code',
    'code': code,
    'client_id': id,
    'scope': 'offline_access User.Read User.ReadWrite',
    'redirect_uri': redirect,
    'client_secret': secret 
  });
  var config = {
    method: 'post',
    url: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded', 
      // 'Cookie': 'buid=0.AQ4AXZgG68oGF0qB2mKauZ9lBe6mu_I1LEVOosHBpPv9JCgOAAA.AQABAAEAAAD--DLA3VO7QrddgJg7WevrDlAxu03j_XZo0fP_3962NbCG8Tms25HqVmzCMaFabw0-jVwxXKE4H76KRS8C7aIDrDKQwDY4H1UesgHqxFyOv3S-kDgw2ulaV_Idlwmtvf4gAA; esctx=AQABAAAAAAD--DLA3VO7QrddgJg7WevrLeXBjgwQaKKmxu9fvnhvSSO8PoFb2hgdFht6iQo-ITNChPWQSU1RHnyleyNopB4zjTaHVVTn01KFhzmh8_kKadDQZoZUYhOUQJONUUq5xtZ_Lq_tIw9MDoU_wico3VwFsuWd8YiOqyqr-541xk7piOMKU4ZpkwNSgQiaFR0TRSYgAA; fpc=Aj-7mMf3IwNIn9cJ9tqoWXD5-pCTBAAAACDKQNkOAAAAYPqRvAEAAAArzUDZDgAAAA; stsservicecookie=estsfd; x-ms-gateway-slice=estsfd'
    },
    data : data
  };
  // let res;
  try {
    const res = await axios(config)
    const {data} = res
    console.log(data);
    return data
  } catch (error) {
    console.log(error);
  }

  // .then(function (response) {
  //   console.log(JSON.stringify(response.data));
  //   res = response.data
  //   return res
  // })
  // .catch(function (error) {
  //   console.log(error);
  // });
  // return res
}



module.exports = async function (context, req) {
  const CLIENT_ID =
  process.env.client_id
  const CLIENT_SECRET =
  process.env.client_secret
  // context.bindings.signalRMessages = [
  //   {
  //     target: 'newMessage',
  //     arguments: [req.body],
  //   },
  // ]
  // context.log(req.body)

 const data = await testFetch(CLIENT_ID,CLIENT_SECRET,req.query.code,req.query.redirect)
  // const header = req.headers['x-ms-client-principal'];
  // const encoded = Buffer.from(header, 'base64');
  // const decoded = encoded.toString('ascii');

  context.res = {
    body: {
     data
    },
  }
}
