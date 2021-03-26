<template>
  <h1>User {{ $route.params.id }}</h1>
  <div class="amin_view">
    <Navigation class="admin_navigation" />
    <router-view></router-view>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import Navigation from "../../components/admin_navigation";
export default {
  components: {
    Navigation
  },
  setup() {
    const route = useRoute();
    console.log(route);
    // this.$watch(
    //   () => this.$route.params,
    //   (toParams, previousParams) => {
    //     // react to route changes...
    //   }
    // );
    return {};
  }
};
</script>

<style lang="css" scoped>
.amin_view {
  position: relative;
  height: auto;
}
.admin_navigation {
  /* position: absolute; */
  top: 0;
  left: 0;
  width: 10vw;
  /* height: 100vh; */
  display: grid;
}
</style>
