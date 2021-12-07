const axios = require('axios')
const qs = require('qs')

const getToken = async (
  id,
  secret,
  refreshOrcode,
  redirect,
  scope,
  grant_type,
  name
) => {
  const data = qs.stringify({
    grant_type: grant_type,
    [name]: refreshOrcode,
    client_id: id,
    scope: scope,
    redirect_uri: redirect,
    client_secret: secret,
  })
  const config = {
    method: 'post',
    url: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: data,
  }
  // let res;
  try {
    const res = await axios(config)
    const { data } = res
    // console.log(data);
    return data
  } catch (error) {
    throw new Error(error)
    // console.log(error, 'ERROR')
  }
}

module.exports = async function (context, req) {
  const CLIENT_ID = process.env.client_id
  const CLIENT_SECRET = process.env.client_secret

  if (req.query.refresh_token) {
    try {
      const data = await getToken(
        CLIENT_ID,
        CLIENT_SECRET,
        req.query.refresh_token,
        req.query.redirect,
        req.query.scope,
        'refresh_token',
        'refresh_token'
      )

      context.res = {
        body: {
          ...data,
        },
      }
    } catch (error) {
      context.res = {
        status: 404,
        body: error
      }

      return
    }

    if (req.query.code) {
      try {
        const data = await getToken(
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
      } catch (error) {
        context.res = {
          status: 404,
          body: error
        }
      }

      return
    }
  }
}
