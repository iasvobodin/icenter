<template>
  <div v-if="$store.state.user.info">
    <h1>Личная старница {{ $store.state.user.info.userDetails.split('@')[0].replace('.',' ') }}</h1>
    <p>в разработке</p>
    <p class="info">{{$store.state.user}}</p>
    <br>
    <button @click="clearUser">Log out</button>
  </div>
</template>

<script>
export default {
  methods: {
    clearUser() {
      window.localStorage.removeItem("user")
      window.location.href = '/.auth/logout?post_logout_redirect_uri=/'
    }
  },
    mounted() {
      console.log(document.cookie);
  //     console.log('try to auth from user page');
  //     const user = window.localStorage.getItem("user")
  //     // console.log(user, 'user');
  // if (user) {
  //     this.$store.commit('setUserAuth', user)
  //   } else{
  //     console.log('not user');
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
