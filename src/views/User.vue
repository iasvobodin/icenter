<template>
  <div v-if="$store.state.user.info">
    <h1>Личная старница {{ $store.state.user.info.userDetails.split('@')[0].replace('.',' ') }}</h1>
    <p>в разработке</p>
    <p class="info">{{$store.state.user}}</p>
    <br>
    <button v-if="localUser" @click="clearUser">Log out</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      localUser: false
    }
  },
  methods: {
    clearUser() {
      window.localStorage.removeItem("user")
      if (
        import.meta.env.MODE === 'development') {
          this.$router.push('/login')
        } else{
          window.location.href = '/.auth/logout?post_logout_redirect_uri=/login'
        }
      this.localUser = window.localStorage.getItem('user')
    }
  },
    mounted() {
      this.localUser = window.localStorage.getItem('user')
      this.$store.dispatch('checkUser')
    // }
  },
};
</script>

<style lang="css" scoped>
.info{
    white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
