const axios = require('axios');
const qs = require('qs');

const getToken = async (id, secret,code,redirect,scope) =>{
  const data = qs.stringify({
    'grant_type': 'authorization_code',
    'code': code,
    'client_id': id,
    'scope': scope,
    'redirect_uri': redirect,
    'client_secret': secret 
  });
  const config = {
    method: 'post',
    url: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded', 
    },
    data : data
  };
  // let res;
  try {
    const res = await axios(config)
    const {data} = res
    // console.log(data);
    return data
  } catch (error) {
    console.log(error,"ERROR");
  }
}



module.exports = async function (context, req) {
  const CLIENT_ID =
  process.env.client_id
  const CLIENT_SECRET =
  process.env.client_secret

 const data = await getToken(CLIENT_ID,CLIENT_SECRET,req.query.code,req.query.redirect,req.query.scope)

  context.res = {
    body: {
     ...data
    },
  }
}


// Line breaks for legibility only

// POST /common/oauth2/v2.0/token HTTP/1.1
// Host: https://login.microsoftonline.com
// Content-Type: application/x-www-form-urlencoded

// client_id=11111111-1111-1111-1111-111111111111
// &scope=user.read%20mail.read
// &refresh_token=OAAABAAAAiL9Kn2Z27UubvWFPbm0gLWQJVzCTE9UkP3pSx1aXxUjq...
// &redirect_uri=http%3A%2F%2Flocalhost%2Fmyapp%2F
// &grant_type=refresh_token
// &client_secret=jXoM3iz...      // NOTE: Only required for web apps