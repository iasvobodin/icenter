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
    <button @click="tryToGetToken">try to get photo</button>
    <a
      :href="`https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=http://localhost:4280/user&scope=offline_access User.Read User.ReadWrite&response_mode=query&state=12345`"
      >GetToken</a
    >
    <!-- <mgt-msal2-provider :client-id="CLIENT_ID"></mgt-msal2-provider>
<mgt-login></mgt-login>
<mgt-people-picker></mgt-people-picker> -->
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
// import {
//     useFetch
// } from '@/hooks/fetch'
import { computed, reactive, onMounted, watch, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFetch } from '@/hooks/fetch'
import { Providers, Msal2Provider } from '@microsoft/mgt';

const router = useRouter()
const route = useRoute()
const store = useStore()
const localUser = ref(false)
const color = ref('')
const colorChanged = ref(true)

const state = reactive({
  userTask: null,
})
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET
let url = new URL('https://example.com?foo=1&bar=2')
console.log(url)
const params = new URLSearchParams(url.search)
console.log(params)





// let params = new URLSearchParams(url.search);
// const params = new URLSearchParams({
// "client_id":"11111111-1111-1111-1111-111111111111",
// "response_type":"code",
// "redirect_uri":"http%3A%2F%2Flocalhost%2Fmyapp%2F",
// "response_mode":"query",
// "scope":"offline_access%20user.read%20mail.read",
// "state":"12345",
// });

// params.set({
// "client_id":"11111111-1111-1111-1111-111111111111",
// "response_type":"code",
// "redirect_uri":"http%3A%2F%2Flocalhost%2Fmyapp%2F",
// "response_mode":"query",
// "scope":"offline_access%20user.read%20mail.read",
// "state":"12345",
// })

// for(var pair of url.searchParams.entries()) {
//    console.log(pair[0]+ ', '+ pair[1]);
// }
// export default {
// data() {
//   return {
//     localUser: false
//   }
// },
// methods: {

  // watch(route, async (newV,OldV)=>{
  //   console.log(newV,OldV);

  // const CODE = newV.code
  // const resToken = await fetch('', {
  //   method: post,
  //   body: JSON.stringify({
  //     grant_type: 'authorization_code',
  //     CODE,
  //     CLIENT_ID,
  //     scope: 'offline_access User.Read User.ReadWrite',
  //     redirect_uri: 'http://localhost:4280/user',
  //     CLIENT_SECRET,
  //   }),
  // })
  // const token = resToken.json()
  // console.log(token);
  // })
const tryToGetToken = () => {
  window.location.href = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=http://localhost:4280/user&scope=offline_access User.Read User.ReadWrite&response_mode=query&state=12345`
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
  var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
// myHeaders.append("Cookie", "buid=0.AQ4AXZgG68oGF0qB2mKauZ9lBe6mu_I1LEVOosHBpPv9JCgOAAA.AQABAAEAAAD--DLA3VO7QrddgJg7WevrM4CUFWANYgxGUNN3OZdqChOQkPET4UhHXo_JwRdf5-I-nnTrBWs9MveZaTM_WpzkLoQx81ntjsN0QS-L1USXWtkL-KxSxDEPaF7uzaEI-L4gAA; esctx=AQABAAAAAAD--DLA3VO7QrddgJg7Wevr-l09SB6HAVgosdN3nT77eEKrn_jn0dnAYx0Ln1o3Hg9bHJXj54_SPzeijPsepRiqV0-WoeK0jouz943Uy0iqk5JsVFjJKpQdUnHDXKVjBJgv957veBsxWj8XkzVjV1CSmXvOVJukeUZgpJy4c21TeIzmMynz5gII5f2n6pJQQl4gAA; fpc=Aj-7mMf3IwNIn9cJ9tqoWXBg-pG8AQAAABTwO9kOAAAAssBWHgEAAACq7zvZDgAAAA; stsservicecookie=estsfd; x-ms-gateway-slice=estsfd");

var urlencoded = new URLSearchParams();
urlencoded.append("grant_type", "authorization_code");
urlencoded.append("code", code);
urlencoded.append("client_id", "f2bba6ee-2c35-4e45-a2c1-c1a4fbfd2428");
urlencoded.append("scope", "offline_access User.Read User.ReadWrite");
urlencoded.append("redirect_uri", "http://localhost:4280/user");
urlencoded.append("client_secret", "SiO7Q~mTU0EB4yvqiYnJ.8s0HiuQwamGt_boP");

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: urlencoded,
  redirect: 'follow'
};

fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
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
    if(route.query.code){
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
