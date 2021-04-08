<template>
  <div id="nav">
    <!-- <router-link to="/">Home</router-link> |
    <router-link to="/User">User</router-link> |
    <router-link to="/admin">Admin</router-link> | -->
    <a href="/.auth/login/aad?post_login_redirect_uri=/user">Login</a> |
    <a href="/.auth/logout?post_logout_redirect_uri=/">Log out</a>
  </div>

  <!-- <router-link to="/.auth/login/aad">login</router-link>
  <br />
  <router-link to="/.auth/logout">log out</router-link> <br /> -->
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
  async mounted() {
    let clientPrincipal = {
      userId: "1298",
      mail: "test@mail.ru",
      userDetails: "super@mail.com"
    };

    // const response = await fetch("/.auth/me");
    // const payload = await response.json();
    // const { clientPrincipal } = payload;
    this.$store.commit("SETuser", clientPrincipal);
  }
};
</script>
