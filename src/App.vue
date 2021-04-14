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
    <router-link v-else to="/User"
      >{{ $store.state.user.authInfo.userDetails }} |
    </router-link>
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
import { onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";
import { ref } from "vue";
export default {
  setup() {
    // same as beforeRouteLeave option with no access to `this`
    onBeforeRouteLeave((to, from) => {
      const answer = window.confirm(
        "Do you really want to leave? you have unsaved changes!"
      );
      // cancel the navigation and stay on the same page
      if (!answer) return false;
    });

    const userData = ref();

    // same as beforeRouteUpdate option with no access to `this`
    onBeforeRouteUpdate(async (to, from) => {
      // only fetch the user if the id changed as maybe only the query or the hash changed
      if (to.params.id !== from.params.id) {
        userData.value = await fetchUser(to.params.id);
      }
    });
  },
  beforeRouteEnter(to, from) {
    console.log("beforeRouteEnter");
    // called before the route that renders this component is confirmed.
    // does NOT have access to `this` component instance,
    // because it has not been created yet when this guard is called!
  },
  created() {
    this.$store.dispatch("GET_auth");
  },
};
</script>
