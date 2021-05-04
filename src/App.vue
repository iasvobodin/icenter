<template>
  <div id="nav">
    <!-- <router-link to="/">Home</router-link> |
    <router-link to="/User">User</router-link> |
    <router-link to="/admin">Admin</router-link> | -->
    <a
      v-if="!$store.state.user.info"
      href="/.auth/login/aad?post_login_redirect_uri=/user"
      >Login |</a
    >
    <router-link v-else to="/User"
      >{{ $store.state.user.info.userDetails }} |
    </router-link>
    <a href="/.auth/logout?post_logout_redirect_uri=/">Log out | </a>
    <router-link to="/admin">Admin</router-link>
  </div>
  <router-view />
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400&display=swap");
button, input[type=submit], ::-webkit-file-upload-button {
  width: min(200px, 20vw);
  height: 35px;
  background-color: #ffffff;
  /* border: none; */
  /* color: white; */
  /* padding: 15px 32px; */
  border: 1px solid rgb(0, 140, 255);
  border-radius: 3px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  box-sizing: border-box;
  font-size: 16px;
}
input[type=submit]:hover {
  background-color: #00a2ff5b;
}
button:hover {
  background-color: #00a2ff5b;
}
h4 {
  margin: 0;
}
p {
  margin: 0;
}
select {
  height: 30px;
  width: 100%;
}
textarea {
  /* height: 30px; */
  width: 100%;
  box-sizing: border-box;
  border-radius: 4px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
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
h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: "Roboto Slab", serif;
  font-weight: normal;
}
</style>
<script>
// import { onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";
// import { ref } from "vue";
export default {
  // setup() {
  //   // same as beforeRouteLeave option with no access to `this`
  //   onBeforeRouteLeave((to, from) => {
  //     const answer = window.confirm(
  //       "Do you really want to leave? you have unsaved changes!"
  //     );
  //     // cancel the navigation and stay on the same page
  //     if (!answer) return false;
  //   });

  //   const userData = ref();

  //   // same as beforeRouteUpdate option with no access to `this`
  //   onBeforeRouteUpdate(async (to, from) => {
  //     // only fetch the user if the id changed as maybe only the query or the hash changed
  //     if (to.params.id !== from.params.id) {
  //       userData.value = await fetchUser(to.params.id);
  //     }
  //   });
  // },
  // beforeRouteEnter(to, from) {
  //   console.log("beforeRouteEnter");
  //   // called before the route that renders this component is confirmed.
  //   // does NOT have access to `this` component instance,
  //   // because it has not been created yet when this guard is called!
  // },
  mounted() {
    function formatDate(date) {
      return (
        date.getDate() +
        "/" +
        "0" +
        (date.getMonth() + 1) +
        "/" +
        date.getFullYear() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes()
      );
    }
    const dd = new Date();
    console.log(formatDate(dd));
  },
  created() {
    !this.$store.state.user.info && this.$store.dispatch("GET_auth");
    !this.$store.state.template && this.$store.dispatch("GET_template");
  },
};
</script>
