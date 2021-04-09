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
    // let clientPrincipal = {
    //   userId: "1298",
    //   mail: "test@mail.ru",
    //   userDetails: "super@mail.com"
    // };
    // let clientPrincipal;

    // try {
    //   const response = await fetch("/.auth/me");
    //   try {
    //     const payload = await response.json();
    //     clientPrincipal = payload.clientPrincipal;
    //   } catch (error) {
    //     console.log("json error", error);
    //     clientPrincipal = {
    //       userId: "zzaaqq",
    //       userDetails: "local@mail.com"
    //     };
    //   }
    // } catch (error) {
    //   console.log("fetch error", error);
    // }

    // await fetch(`/api/user/${clientPrincipal.userId}`, {
    //   method: "POST", // или 'PUT'
    //   body: JSON.stringify({
    //     id: clientPrincipal.userId,
    //     type: "info",
    //     authInfo: clientPrincipal,
    //     userInfo: {}
    //   })
    // });
    // const userData = await user.json();
    // console.log(userData[0], "userData");
    // this.$store.commit("SETuser", clientPrincipal);
    // this.user = userData[0];
    // this.user.userRoles.includes("admin") && this.$router.push(`/admin/`);
    // this.user.userRoles.includes("fitter") && this.$router.push(`/fitter/`);
    // this.user.userRoles.includes("engineer") && this.$router.push(`/engineer/`);

    // this.$store.commit("SETuser", clientPrincipal);
    this.$store.dispatch("GET_auth");

    // console.log(this.$store.state.user);
  },
};
</script>
