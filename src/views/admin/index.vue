<template>
  <!-- <h1>User {{ $route.params.id }}</h1> -->
  <div class="amin_view">
    <!-- <Navigation class="admin_navigation" /> -->
    <h1>!!!!!!!!!!!!!!!!!</h1>
    <router-view></router-view>
  </div>
</template>

<script>
// import { useRoute } from "vue-router";
// import Navigation from "@/components/adminNavigation.vue";
export default {
  components: {
    // Navigation,
  },
    beforeRouteEnter (to, from, next) {
      // return false
      console.log('here');
      next({name: 'login'})
  // next(vm => {
  //   console.log(vm, 'vm');
  //   // access to component public instance via `vm`
  // })
  },
};
</script>

<style lang="css" scoped>
.amin_view {
  position: relative;
  height: auto;
}

</style>
