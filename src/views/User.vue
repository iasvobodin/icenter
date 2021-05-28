<template>
  <div v-if="$store.state.user.info">
    <h1>Личная старница {{ $store.state.user.info.userDetails.split('@')[0].replace('.',' ') }}</h1>
    <p>в разработке</p>
    <p>{{$store.state.user}}</p>
    <br>
    <a href="/.auth/logout?post_logout_redirect_uri=/">Log out</a>
  </div>
</template>

<script>
export default {
    mounted() {
  //     console.log('try to auth from user page');
  //     const user = window.sessionStorage.getItem("user")
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

<style lang="scss" scoped></style>
