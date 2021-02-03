<template>
  <div></div>
</template>

<script>
export default {
  setup() {
    console.log(this.$route.params);
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
