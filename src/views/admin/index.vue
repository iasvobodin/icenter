<template>
  <div class="amin_view">
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
     
      JSON.parse(window.localStorage.getItem("user")).info.userRoles.includes('admin')? next(): next({name: 'login'})
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
