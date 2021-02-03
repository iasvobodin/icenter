<template>
  <div></div>
</template>

<script>
import { useRoute } from "vue-router";
export default {
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

<style lang="scss" scoped></style>
