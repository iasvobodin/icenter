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
    <!-- <a
      :href="url"
      >GetToken</a
    > -->
    <!-- <mgt-msal2-provider :client-id="CLIENT_ID"></mgt-msal2-provider>
<mgt-login></mgt-login>
<mgt-people-picker></mgt-people-picker> -->
<img :src="userFromStore.body.photo" alt="">
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { computed, reactive, onMounted, watch, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFetch } from '@/hooks/fetch'


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
const redirectUri = `${location.origin}/user`
const scope = "offline_access User.Read User.ReadWrite"

const url = new URL("https://login.microsoftonline.com/common/oauth2/v2.0/authorize");
url.searchParams.append("client_id", CLIENT_ID);
url.searchParams.append("response_type", "code");
url.searchParams.append("redirect_uri", redirectUri);
url.searchParams.append("scope", scope);
url.searchParams.append("response_mode", "query");

const tryToGetToken = () => {
  location.href = url
}

const savePhoto = async () => {
  const updateUser = JSON.parse(JSON.stringify(store.state.user)) 
  updateUser.body.photo = `https://icaenter.blob.core.windows.net/user-photo/${store.state.user.info.userDetails}`

  console.log(updateUser,'updateUser');
//  await store.dispatch(' CHECK_AUTH_SERVER',updateUser)
  const options = {
    method: 'POST', // или 'PUT'
    body: JSON.stringify(updateUser),
  }
  const saveColorReq = await fetch(
    `/api/user/${store.state.user.id}?postRegisterUser=true`,
    options
)

  if (saveColorReq.ok) {
    // colorChanged.value = true
    await store.dispatch('checkUser')
    // document.documentElement.style.setProperty('--bg', `${color.value}`)
  }
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

  fetch('https://graph.microsoft.com/v1.0/me/photo/$value', requestOptions)
    .then((response) => response.blob())
    .then(result => {
      console.log(result);
      const formData = new FormData()
      formData.set('photo', result, store.state.user.info.userDetails)
      store.commit('SetPhotosToUpload', formData)
      console.log('commit formdata');
      try {
        store.dispatch('UPLOAD_PHOTOS', 'user-photo')
        console.log('dispatch photo');
      } catch (error) {
        console.log(error);
      }
      savePhoto()
      // 'https://icaenter.blob.core.windows.net/user-photo/'

    })//.then(savePhoto)
    .catch((error) => console.log('error', error))
}



const userFromStore = computed(() => JSON.parse(window.localStorage.getItem('user')))
// console.log(import.meta.env.VITE_CLIENT_ID,"test env");
const getUserTask = async () => {
  const { request, response } = useFetch(
    `/api/GET_userTasks?user=${userFromStore.value.info.userDetails.toLowerCase()}`
  )
  try {
    userFromStore.value && (await request())
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

onMounted(async () => {
  localUser.value = window.localStorage.getItem('user')
  // store.dispatch('checkUser')

  if (route.query.code) {
    console.log('FETCH!!!');
    const {request, response} = useFetch(`api/GET_token?code=${route.query.code}&redirect=${redirectUri}&scope=${scope}`)
    await request()
    console.log(response.value);
    router.replace({ path: '/user' })
  }
})
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
