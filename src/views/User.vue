<template>
  <div v-if="$store.state.user.info">
    <h1>Личная старница {{ $store.state.user.info.userDetails.split('@')[0].replace('.',' ') }}</h1>
    <p>в разработке</p>
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
// export default {
// data() {
//   return {
//     localUser: false
//   }
// },
// methods: {
const clearUser = () => {
  window.localStorage.removeItem("user")
  if (
    import.meta.env.MODE === 'development') {
    router.push('/login')
  } else {
    window.location.href = '/.auth/logout?post_logout_redirect_uri=/login'
  }
  localUser.value = window.localStorage.getItem('user')
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
.info{
    white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
