<template>
  <div v-if="userFromStore.info" class="holder">
    <h1 class="userHeader"> <span>{{ userFromStore.info.userDetails.split('@')[0].replace('.', ' ') }}</span> <button class="logOut" v-if="localUser" @click="clearUser">Log out</button></h1>
   
    <!-- <p>в разработке</p> -->
  <!-- <div class="profile"> -->

  
    <div class="profile__settings">
      <h2>Настройки профиля</h2>
      <label
        >Choose background color
        <input
          type="color"
          value="#ffffff"
          @input="checkInput($event)" /></label
      ><br /><br />
      <button v-if="color" :disabled="colorChanged" @click="saveColor">
        Save color
      </button>
      <!-- <p class="info">{{userFromStore}}</p> -->
      <!-- <button v-if="localUser" @click="clearUser">Log out</button><br /> -->
      <button v-if="!userFromStore.body.photo" class="get__access" @click="tryToGetToken">
        Получить фотографию профиля
      </button>
      <!-- <button class="get__access" @click="tryToSingIn">tryToSingIn</button>
    <p v-if="state.token">{{ state.token }}</p> -->
    </div>

    <div class="task">
      <h2>Ваша текущая задача.</h2>
      <div
        v-if="state.userTask"
        style="cursor: pointer"
        @click="$router.push(`/tasks/${state.userTask.id}`)"
        class="task_card item__card"
      >
        <div class="user__photo__holder">
          <img
            :src="
              userFromStore.body.photo
                ? userFromStore.body.photo
                : '/img/user.png'
            "
            alt=""
          />
        </div>
        <div class="task__description">
          <p>Проект : {{ state.userTask.info.Проект }}</p>
          <p>Шкаф : {{ state.userTask.info.Шкаф }}</p>
          <p>Время работы: {{ time }}</p>
        </div>
      </div>
      <h4 v-else>Нет активных задач.</h4>
    </div>
    <!-- </div> -->
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { computed, reactive, onMounted, watch, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFetch } from '@/hooks/fetch'
import { msalInstance } from '@/authConfig'

const router = useRouter()
const route = useRoute()
const store = useStore()
const localUser = ref(false)
const color = ref('')
const colorChanged = ref(true)

const state = reactive({
  userTask: null,
  token: null,
  passedTime: 0,
})

const userFromStore = computed(() =>
  JSON.parse(JSON.stringify(store.state.user))
)

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET

const redirectUri = `${location.origin}/user`
const scope = 'offline_access User.Read User.ReadWrite'

const url = new URL(
  'https://login.microsoftonline.com/common/oauth2/v2.0/authorize'
)
url.searchParams.append('client_id', CLIENT_ID)
url.searchParams.append('response_type', 'code')
url.searchParams.append('redirect_uri', redirectUri)
url.searchParams.append('scope', scope)
url.searchParams.append('response_mode', 'query')
console.log(url, 'TEST SECRET')

const tryToSingIn = async () => {
  var loginRequest = {
    scopes: ['User.ReadWrite'],
  }

  try {
    const loginResponse = await msalInstance.loginPopup(loginRequest)
  } catch (err) {}
}

const CurrentTime = Date.now()

const time = computed(
  () => new Date(state.passedTime).toISOString().substr(11, 8) // time like hors and minutes
)
// state.pps =
// const startTick = ()=>{
setInterval(() => {
  state.passedTime += 1000
  // console.log(state.passedTime)
}, 1000)

const tryToGetToken = async () => {
  const account = msalInstance.getAllAccounts()[0]
  console.log(account, 'ACCOUNT')
  var request = {
    scopes: ['offline_access User.Read User.ReadWrite'],
    account: account,
  }

  try {
    const acquireTokenSilent = await msalInstance.acquireTokenSilent(request)
    console.log(acquireTokenSilent, 'exist SILENT')
    //  ((acquireTokenSilent)=>{
    state.token = acquireTokenSilent
    // })(acquireTokenSilent)
  } catch (error) {
    console.log(error)
    try {
      const acquireTokenPopup = await msalInstance.acquireTokenPopup(request)
      console.log(acquireTokenPopup, 'NOT exist SILENT')
      state.token = acquireTokenPopup
    } catch (error) {}
  }
  try {
    await updateUser(state.token)
    await getPhoto(state.token.accessToken)
    await savePhoto()
  } catch (error) {
    console.log(error)
  }

  console.log('DONE')
}

const savePhoto = async () => {
  const updateUser = JSON.parse(JSON.stringify(store.state.user))
  updateUser.body.photo = `https://icaenter.blob.core.windows.net/user-photo/${store.state.user.info.userDetails}`

  await store.dispatch('CHECK_AUTH_SERVER', updateUser)
}
const getPhoto = async (token) => {
  var myHeaders = new Headers()
  myHeaders.append('Authorization', `Bearer ${token}`)

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  }

  const resPhoto = await fetch(
    'https://graph.microsoft.com/v1.0/me/photo/$value',
    requestOptions
  )
  const photo = await resPhoto.blob()

  const formData = new FormData()
  formData.set('photo', photo, store.state.user.info.userDetails)
  store.commit('SetPhotosToUpload', formData)
  console.log('commit formdata')
  try {
    store.dispatch('UPLOAD_PHOTOS', 'user-photo')
    console.log('dispatch photo')
  } catch (error) {
    console.log(error)
  }
}

// console.log(import.meta.env.VITE_CLIENT_ID,"test env");
const getUserTask = async () => {
  const { request, response } = useFetch(
    `/api/GET_userTasks?user=${userFromStore.value.info.userDetails.toLowerCase()}`
  )
  try {
    userFromStore.value && (await request())
    state.userTask = response.value
    state.passedTime = CurrentTime - state.userTask.timeStart
  } catch (error) {
    console.log(error.message)
  }
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
async function updateUser(token) {
  const clone = JSON.parse(JSON.stringify(store.state.user))
  clone.token = token
  await store.dispatch('CHECK_AUTH_SERVER', clone)
}
onMounted(async () => {
  localUser.value = window.localStorage.getItem('user')
  // store.dispatch('checkUser')

  if (route.query.code) {
    console.log('FETCH!!!')
    const { request, response } = useFetch(
      `api/GET_token?code=${route.query.code}&redirect=${redirectUri}&scope=${scope}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
    )
    await request()
    console.log(response.value)
    await updateUser(response.value)
    router.replace({ path: '/user' })
  }
  !userFromStore.value.body.photo &&
    userFromStore.value.token?.access_token &&
    (await getPhoto(userFromStore.value.token.access_token))
})
</script>

<style lang="css" scoped>
.logOut{
  width: fit-content;
  text-align: center;
  vertical-align: middle;
}
.profile{
  display: grid;
  grid-auto-flow: column;
}

.profile__settings{
  place-self: start;
}

.task_card {
  max-height: 150px;
  width: min(450px, 95vw);
  margin: 3vh auto;
  display: grid;
  grid-auto-flow: column;
}
.task__description {
  place-self: center;
}
.task__description p {
  margin: 10px;
}
.user__photo__holder {
  place-self: center;
  overflow: hidden;
  border-radius: 50%;
  width: 100px;
  height: 100px;
}
.user__photo__holder img {
  object-fit: cover;
  object-position: center;
  width: 100%;
  height: 100%;
}
.holder {
  min-height: calc(100vh - 125px);
  background-color: v-bind('color');
}
.userHeader {
  width: fit-content;
  margin: auto;
}
.info {
  color: #ffffff;
  white-space: pre-wrap;
  word-wrap: break-word;
}
.get__access {
  /* position: relative; */
  /* bottom: 2vh; */
}
</style>
