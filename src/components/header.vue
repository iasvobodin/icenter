<template>
    <div class="app__header">
<navigation-panel/>
  <div>
    <a
      v-if="!$store.state.user.info"
      href="/.auth/login/aad?post_login_redirect_uri=/user"
      >Login    |</a>
    <router-link v-else to="/user"
      >{{ $store.state.user.info.userDetails }} |
    </router-link><br>
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
a{text-decoration-line: none;
color: #ffffff;
text-decoration-color: rgb(255, 255, 255);}
.app__header{
    height: 50px;
    width: 100%;
     background-color: #3b3f4d;
      box-shadow: inset 0px 2px 3px 0px rgb(0 0 0 / 40%), 0px 1px 2px 0px rgb(255 255 255 / 20%);
     z-index: 3;
    /* position: absolute;
    top: 0; */
}
</style>