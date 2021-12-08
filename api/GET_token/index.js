// import {axios} from 'axios'
const axios = require('axios')
const qs = require('qs')
const https = require('https')

function httprequest( 
  id,
  secret,
  refreshOrcode,
  redirect,
  scope,
  grant_type,
  name) {
  return new Promise((resolve, reject) => {
    const httpAgent = new https.Agent();
    httpAgent.maxSockets = 200;

    const postData = qs.stringify({
      "grant_type": grant_type,
      [name]: refreshOrcode,
      "client_id": id,
      "scope": scope,
      "redirect_uri": redirect,
      "client_secret": secret,
    })

    const options = {
      hostname: 'login.microsoftonline.com',
      path: '/common/oauth2/v2.0/token',
      method: 'POST',
      agent: httpAgent,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
      }
    }

 

     const req = https.request(options, (res) => {
       if (res.statusCode < 200 || res.statusCode >= 300) {
             return reject(new Error('statusCode=' + res.statusCode));
         }
         var body = [];
         res.on('data', function(chunk) {
             body.push(chunk);
         });
         res.on('end', function() {
             try {
                 body = JSON.parse(Buffer.concat(body).toString());
             } catch(e) {
                 reject(e);
             }
             console.log("THIS IS DATA",body);
             resolve(body);
         });
     });
     req.on('error', (e) => {
       reject(e.message);
     });
     // send the request
     req.write(postData)

    req.end();
 });
}

// async function postNode( 
//   id,
//   secret,
//   refreshOrcode,
//   redirect,
//   scope,
//   grant_type,
//   name){
//     console.log("START TO NODE")
//     const httpAgent = new https.Agent();
//     httpAgent.maxSockets = 200;

// const data = qs.stringify({
//   "grant_type": grant_type,
//   [name]: refreshOrcode,
//   "client_id": id,
//   "scope": scope,
//   "redirect_uri": redirect,
//   "client_secret": secret,
// })
// console.log("THIS IS DATA",data);
// const options = {
//   hostname: 'login.microsoftonline.com',
//   // port: 443,
//   path: '/common/oauth2/v2.0/token',
//   method: 'POST',
//   agent: httpAgent,
//   headers: {
//     'Content-Type': 'application/x-www-form-urlencoded',
//     'Content-Length': data.length
//   }
// }

// const chunks = [];
// const req = https.request(options, res => {
//   console.log(`statusCode: ${res.statusCode}`)


//   res.on("data", function (chunk) {
//     chunks.push(chunk);
//   });
  
//   res.on("end", function (chunk) {
//     const body = Buffer.concat(chunks);
//     console.log("THIS IS RESPONSE",body.toString());
//     // return body
//   });
// })



// req.on('error', error => {
//   // console.error(error)
// })

// req.write(data)
// req.end()
// console.log("END TO NODE", req)
// }


// async function getToken (
//   id,
//   secret,
//   refreshOrcode,
//   redirect,
//   scope,
//   grant_type,
//   name
// ){
//   const data = qs.stringify({
//     grant_type: grant_type,
//     [name]: refreshOrcode,
//     client_id: id,
//     scope: scope,
//     redirect_uri: redirect,
//     client_secret: secret,
//   })
//   const config = {
//     method: 'post',
//     url: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     data: data,
//   }
//   // let res;
//   try {
//     const response = await axios(config)
//     // const { data } = response
//     // console.log(data);
//     return response.data
//   } catch (error) {
//     // context.log.error('ERROR', error);
//   }
// }
// req.query.client_id,
// req.query.client_secret,
module.exports = async function (context, req) {
  const CLIENT_ID = process.env['AzureClienId']
  const CLIENT_SECRET = process.env['AzureClientSecret']

  if (req.query.test) {
    context.log(process.env)
   context.res = {
      status: 200,
      body: `${CLIENT_ID,CLIENT_SECRET}`,
    }
    return
  }

  if (req.query.refresh_token&&CLIENT_ID&&CLIENT_SECRET) {
    // try {
context.log("TRY TO NODE")

    //  const tt = await 
    const data = await httprequest(
        CLIENT_ID,
        CLIENT_SECRET,
        req.query.refresh_token,
        req.query.redirect,
        req.query.scope,
        'refresh_token',
        'refresh_token'
      )
// console.log("AWAIT FUNCTION",token);


      // const data = await getToken(
      //   CLIENT_ID,
      //   CLIENT_SECRET,
      //   req.query.refresh_token,
      //   req.query.redirect,
      //   req.query.scope,
      //   'refresh_token',
      //   'refresh_token'
      // )

      context.res = {
        body: {
          ...data,
        },
      }
      return 
    // } catch (error) {
    //   return (context.res = {
    //     status: 404,
    //     body: error,
    //   })
    // }
  }
  if (req.query.code&&CLIENT_ID&&CLIENT_SECRET) {
    // try {
      const data = await httprequest(
        CLIENT_ID,
        CLIENT_SECRET,
        req.query.code,
        req.query.redirect,
        req.query.scope,
        'authorization_code',
        'code'
      )
       context.res = {
        body: {
          ...data,
        },
      }
      return
    // } catch (error) {
    //   return (context.res = {
    //     status: 404,
    //     body: error,
    //   })
    // }
  }
}
