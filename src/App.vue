<template>
  <div id="nav">
    <!-- <router-link to="/">Home</router-link> |
    <router-link to="/User">User</router-link> |
    <router-link to="/admin">Admin</router-link> | -->
    <a
      v-if="!$store.state.user.authInfo"
      href="/.auth/login/aad?post_login_redirect_uri=/user"
      >Login |</a
    >
    <router-link v-else to="/User">{{ $store.state.user.authInfo.userDetails }} | </router-link>
    <a href="/.auth/logout?post_logout_redirect_uri=/">Log out | </a>
    <router-link to="/admin">Admin</router-link>
  </div>
  <router-view />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
<script>
export default {
  created() {
    this.$store.dispatch("GET_auth");
  },
};
</script>
