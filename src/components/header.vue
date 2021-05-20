<template>
    <div class="app__header">
<navigation-panel/>
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
    </div>
</template>

<script>
import navigationPanel from "@/components/adminNavigation.vue";
    export default {
          components: {
    navigationPanel
    }
    }
</script>

<style lang="css" scoped>
.app__header{
    height: 50px;
    width: 100%;
    background-color: rgb(0, 183, 255);
    position: fixed;
    top: 0;
}
</style>