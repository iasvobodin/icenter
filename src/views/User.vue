<template>
  <div class="holder" v-if="$store.state.user.info">
    <h1 class="userHeader">Личная старница {{ $store.state.user.info.userDetails.split('@')[0].replace('.',' ') }}</h1>
    <!-- <p>в разработке</p> -->
    <label>Choose background color <input @input="checkInput($event)" type="color" value="#ffffff"></label><br><br>
    <button :disabled="colorChanged" v-if="color" @click="saveColor">Save color</button>
    <br>
    
    <!-- <p class="info">{{$store.state.user}}</p> -->
    <br>
    <button v-if="localUser" @click="clearUser">Log out</button>
  </div>
</template>

<script setup>
import {
  useStore
} from 'vuex'
// import {
//     useFetch
// } from '@/hooks/fetch'
import {
  computed,
  reactive,
  onMounted,
  watch,
  ref
} from 'vue'
import {
  useRouter,
  useRoute
} from 'vue-router'
const router = useRouter()
const store = useStore()
const localUser = ref(false)
const color = ref("")
const colorChanged = ref(true)
// export default {
// data() {
//   return {
//     localUser: false
//   }
// },
// methods: {
  const saveColor = async () => {
    const updateUser = JSON.parse(JSON.stringify(store.state.user))
    updateUser.body.bg = color.value
    const options = {
      method: "POST", // или 'PUT'
      body: JSON.stringify(updateUser)
    }
    const saveColorReq = await fetch(`/api/user/${store.state.user.id}?postRegisterUser=true`, options)
    if (saveColorReq.ok) {
      colorChanged.value = true
      await store.dispatch('checkUser')
      document.documentElement.style.setProperty('--bg', `${color.value}`);
    }
    // document.documentElement.style.setProperty('--cursor', `${userFromLocal.body?.customCursor}`)
  }
  const checkInput = (e) => {
    colorChanged.value = false
color.value = e.target.value;
  }
const clearUser = () => {
  window.localStorage.removeItem("user")
  if (
    import.meta.env.MODE === 'development') {
    router.push('/login')
  } else {
    window.location.href = '/.auth/logout?post_logout_redirect_uri=/login'
  }
  // localUser.value = window.localStorage.getItem('user')
  window.localStorage.removeItem("user")
}
// },
// const user = computed(() => store.state.user.info ? store.state.user : false );

// watch(user, async () => {
//   console.log('im watching');
//   await store.dispatch('checkUser')
// })
onMounted(() => {
  localUser.value = window.localStorage.getItem('user')
  store.dispatch('checkUser')
  // }
})
// };
</script>

<style lang="css" scoped>
.holder{
  min-height: calc(100vh - 50px);
  background-color: v-bind('color');
}
.userHeader{
  margin: 0;
}
.info{
  color: #ffffff;
    white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
