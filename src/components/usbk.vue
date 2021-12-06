<template>
  <div v-if="userFromStore.info" class="holder">
    <h1 class="userHeader">
      Личная старница
      {{ userFromStore.info.userDetails.split('@')[0].replace('.', ' ') }}
    </h1>
    <!-- <p>в разработке</p> -->
    <label
      >Choose background color
      <input type="color" value="#ffffff" @input="checkInput($event)" /></label
    ><br /><br />
    <button v-if="color" :disabled="colorChanged" @click="saveColor">
      Save color
    </button>
    <br />

    <!-- <p class="info">{{userFromStore}}</p> -->
    <br />
    <button v-if="localUser" @click="clearUser">Log out</button><br />
    <br />
    <h2
      v-if="state.userTask"
      style="cursor: pointer"
      @click="$router.push(`/tasks/${state.userTask.id}`)"
    >
      {{ state.userTask.id }}
    </h2>
    <button
      v-if="userFromStore.info.identityProvider === 'aad'"
      @click="tryToGetToken2"
    >
      Загрузить фото
    </button>
    <!-- <a
      :href="`https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=http://localhost:4280/user&scope=offline_access User.Read User.ReadWrite&response_mode=query&state=12345`"
      >GetToken</a
    > -->
    <!-- <mgt-msal2-provider :client-id="CLIENT_ID"></mgt-msal2-provider>
<mgt-login></mgt-login>
<mgt-people-picker></mgt-people-picker> -->
    <img :src="userFromStore.body.photo" alt="" />
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
// import * as Msal from '@azure/msal-browser'
// import {
//     useFetch
// } from '@/hooks/fetch'
import { computed, reactive, onMounted, watch, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFetch } from '@/hooks/fetch'
// import { Providers, Msal2Provider } from '@microsoft/mgt';
// import { useMsalAuthentication } from '@/hooks/useMsalAuthentication'
// import { InteractionType } from '@azure/msal-browser'
// import { reactive, watch } from 'vue'
// import { loginRequest } from "@/authConfig";
import { msalInstance, loginRequest, graphConfig } from '@/authConfig'

const router = useRouter()
const route = useRoute()
const store = useStore()
const localUser = ref(false)
const color = ref('')
const colorChanged = ref(true)

const state = reactive({
  userTask: null,
})

const publicClientApplication = msalInstance
const savePhoto = async () => {
  const updateUser = JSON.parse(JSON.stringify(store.state.user))
  updateUser.body.photo = `https://icaenter.blob.core.windows.net/user-photo/${store.state.user.info.userDetails}`
  CHECK_AUTH_SERVER
  const options = {
    method: 'POST', // или 'PUT'
    body: JSON.stringify(updateUser),
  }
  const saveColorReq = await fetch(
    `/api/user/${store.state.user.id}?postRegisterUser=true`,
    options
  )
  // document.documentElement.style.setProperty('--cursor', `${userFromLocal.body?.customCursor}`)
}
const getPhoto = async (token) => {
  var myHeaders = new Headers()
  myHeaders.append('Authorization', `Bearer ${token}`)
  // myHeaders.append('Content-Type', 'image/jpg')

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  }

  const photoRes = await fetch(
    `https://graph.microsoft.com/v1.0/me/photo/$value`,
    requestOptions
  )
  const photo = await photoRes.blob()

  const formData = new FormData()
  formData.set('photo', photo, store.state.user.info.userDetails)
  store.commit('SetPhotosToUpload', formData)
  await store.dispatch('UPLOAD_PHOTOS', 'user-photo')
  const updateUser = JSON.parse(JSON.stringify(store.state.user))
  updateUser.body.photo = `https://icaenter.blob.core.windows.net/user-photo/${store.state.user.info.userDetails}`
  await store.dispatch('CHECK_AUTH_SERVER', updateUser)
}
let accountId = ''
let accessToken = ''
// // const myMsal = new PublicClientApplication(config);

function handleResponse(response) {
  if (response !== null) {
    accountId = response.account.homeAccountId
    // Display signed-in user content, call API, etc.
  } else {
    // In case multiple accounts exist, you can select
    const currentAccounts = publicClientApplication.getAllAccounts()

    if (currentAccounts.length === 0) {
      // no accounts signed-in, attempt to sign a user in
      publicClientApplication.loginRedirect(loginRequest)
    } else if (currentAccounts.length > 1) {
      // Add choose account code here
    } else if (currentAccounts.length === 1) {
      accountId = currentAccounts[0].homeAccountId

      const accessTokenRequest = {
        scopes: ['User.Read', 'User.ReadWrite'],
        account: currentAccounts[0],
      }

      publicClientApplication
        .acquireTokenSilent(accessTokenRequest)
        .then(function (accessTokenResponse) {
          // Acquire token silent success
          // Call API with token
          accessToken = accessTokenResponse.accessToken
          // console.log(accessToken);
          getPhoto(accessToken)
          // Call your API with token
          // callApi(accessToken);
        })
    }
  }
  console.log(accountId)
}

const tryToGetToken = async () => {
  const tryToAuth = await publicClientApplication.handleRedirectPromise()
  handleResponse(tryToAuth)
}

const tryToGetToken2 = async () => {
  const redirectResponse = await publicClientApplication.handleRedirectPromise()
  if (redirectResponse !== null) {
    // Acquire token silent success
    let accessToken = redirectResponse.accessToken
    // Call your API with token
    getPhoto(accessToken)
  } else {
    const account = publicClientApplication.getAllAccounts()[0]

    const accessTokenRequest = {
      scopes: ['User.Read', 'User.ReadWrite'],
      account: account,
    }

    try {
      const acquireToken = await publicClientApplication.acquireTokenSilent(
        accessTokenRequest
      )
      let accessToken = acquireToken.accessToken
     accessToken&& (await getPhoto(accessToken))
    } catch (error) {
      console.log(error)
      // if (error instanceof InteractionRequiredAuthError) {
      // const acquireTokenRedirect = await 
      publicClientApplication.acquireTokenRedirect(accessTokenRequest)
      // let accessToken = acquireTokenRedirect.accessToken
    //  accessToken&& (await getPhoto(accessToken))
      // console.log(acquireTokenRedirect);
      // }
    }

    // catch(function (error) {
    //         //Acquire token silent failure, and send an interactive request
    //         console.log(error);
    //         if (error instanceof InteractionRequiredAuthError) {
    //             publicClientApplication.acquireTokenRedirect(accessTokenRequest);
    //         }
    //     });
  }
  // const loginPopup = await publicClientApplication.loginPopup(loginRequest)
  //   const currentAccounts = publicClientApplication.getAllAccounts()[0]
  //   const accessTokenRequest = {
  //         scopes: ['User.Read', 'User.ReadWrite'],
  //         account: currentAccounts,
  //       }
  // try {
  //   const {accessToken} = await publicClientApplication.acquireTokenSilent(accessTokenRequest)
  //  accessToken&&(await getPhoto(accessToken))

  // } catch (error) {
  //   console.log(error,'get token silent fail');
  //  const {accessToken} = publicClientApplication.acquireTokenPopup(accessTokenRequest)
  //  await getPhoto(accessToken)
  // }

  //  const {accessToken} = await publicClientApplication.acquireTokenSilent(accessTokenRequest)

  //   publicClientApplication.acquireTokenSilent(accessTokenRequest).then(function(accessTokenResponse) {
  //     // Acquire token silent success
  //     let accessToken = accessTokenResponse.accessToken;
  //     // Call your API with token
  //     callApi(accessToken);
  // }).catch(function (error) {
  //     //Acquire token silent failure, and send an interactive request
  //     if (error instanceof InteractionRequiredAuthError) {
  //         publicClientApplication.acquireTokenPopup(accessTokenRequest).then(function(accessTokenResponse) {
  //             // Acquire token interactive success
  //             let accessToken = accessTokenResponse.accessToken;
  //             // Call your API with token
  //             callApi(accessToken);
  //         }).catch(function(error) {
  //             // Acquire token interactive failure
  //             console.log(error);
  //         });
  //     }
  //     console.log(error);
  // });
}

const userFromStore = computed(() => store.state.user)
// console.log(import.meta.env.VITE_CLIENT_ID,"test env");
const getUserTask = async () => {
  const { request, response } = useFetch(
    `/api/GET_userTasks?user=${store.state.user.info.userDetails.toLowerCase()}`
  )
  try {
    await request()
  } catch (error) {
    console.log(error.message)
  }
  state.userTask = response.value
}
getUserTask()

const saveColor = async () => {
  const updateUser = JSON.parse(JSON.stringify(store.state.user))
  updateUser.body.bg = color.value
  const options = {
    method: 'POST', // или 'PUT'
    body: JSON.stringify(updateUser),
  }
  const saveColorReq = await fetch(
    `/api/user/${store.state.user.id}?postRegisterUser=true`,
    options
  )
  if (saveColorReq.ok) {
    colorChanged.value = true
    await store.dispatch('checkUser')
    document.documentElement.style.setProperty('--bg', `${color.value}`)
  }
  // document.documentElement.style.setProperty('--cursor', `${userFromLocal.body?.customCursor}`)
}
const checkInput = (e) => {
  colorChanged.value = false
  color.value = e.target.value
}
const clearUser = () => {
  window.localStorage.removeItem('user')
  window.location.href = '/.auth/logout?post_logout_redirect_uri=/login'
}
const fetchToken = (code) => {
  var myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded')
  // myHeaders.append("Cookie", "buid=0.AQ4AXZgG68oGF0qB2mKauZ9lBe6mu_I1LEVOosHBpPv9JCgOAAA.AQABAAEAAAD--DLA3VO7QrddgJg7WevrM4CUFWANYgxGUNN3OZdqChOQkPET4UhHXo_JwRdf5-I-nnTrBWs9MveZaTM_WpzkLoQx81ntjsN0QS-L1USXWtkL-KxSxDEPaF7uzaEI-L4gAA; fpc=Aj-7mMf3IwNIn9cJ9tqoWXBg-pG8AgAAADl7P9kOAAAA; stsservicecookie=estsfd; x-ms-gateway-slice=estsfd");

  var urlencoded = new URLSearchParams()
  urlencoded.append('grant_type', 'authorization_code')
  urlencoded.append('code', code)
  urlencoded.append('client_id', 'f2bba6ee-2c35-4e45-a2c1-c1a4fbfd2428')
  urlencoded.append('scope', 'offline_access User.Read User.ReadWrite')
  urlencoded.append('client_secret', 'SiO7Q~mTU0EB4yvqiYnJ.8s0HiuQwamGt_boP')

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow',
  }

  fetch(
    'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log('error', error))
}
onMounted(async () => {
  localUser.value = window.localStorage.getItem('user')
  store.dispatch('checkUser')

  // Providers.globalProvider = new Msal2Provider({
  //   clientId: CLIENT_ID
  // });
  // function component() {
  //   const element = document.createElement('div');
  //   element.innerHTML = '<mgt-login></mgt-login>';
  //   return element;
  // }

  // document.body.appendChild(component());
  if (route.query.code) {
    fetchToken(route.query.code)
  }
  //       console.log('has code');
  // const CODE = route.query.code
  //   const resToken = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
  //     method: 'post',
  //     mode: 'no-cors',
  //     headers:{
  //       'Content-Type':'application/x-www-form-urlencoded',
  //       // 'Host':'https://login.microsoftonline.com'
  //     },
  //     // body: JSON.stringify({
  //     //   state:"12345",
  //     //   grant_type: 'authorization_code',
  //     //   code:CODE,
  //     //   client_id:CLIENT_ID,
  //     //   scope: 'offline_access User.Read User.ReadWrite',
  //     //   redirect_uri: 'http://localhost:4280/user',
  //     //   client_secret:CLIENT_SECRET,
  //     // }),
  //     body:{
  //       // Content-Type:"application/x-www-form-urlencoded",
  // grant_type:"authorization_code",
  // code:CODE,
  // client_id:"f2bba6ee-2c35-4e45-a2c1-c1a4fbfd2428",
  // scope:"offline_access User.Read User.ReadWrite",
  // redirect_uri:"http://localhost:4280/user",
  // client_secret:"SiO7Q~mTU0EB4yvqiYnJ.8s0HiuQwamGt_boP",
  //     }
  //   })
  //   const token = resToken.json()
  //   console.log(token);
  //     }
})
// };
</script>

<style lang="css" scoped>
.holder {
  min-height: calc(100vh - 50px);
  background-color: v-bind('color');
}
.userHeader {
  margin: 0;
}
.info {
  color: #ffffff;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
