<template>
  <div class="about">
    <h1>User page</h1>
    <h2 v-if="user">{{ user.userDetails }} {{ user.userRoles }}</h2>
  </div>
</template>

 <script>
export default {
  data() {
    return {
      user: null,
    };
  },
  async mounted() {
    const response = await fetch("/.auth/me");
    const payload = await response.json();
    const { clientPrincipal } = payload;
    this.user = clientPrincipal;
    this.user.userRoles.includes("admin") && this.$router.push(`/admin/`);
    this.user.userRoles.includes("fitter") && this.$router.push(`/fitter/`);
    this.user.userRoles.includes("engineer") && this.$router.push(`/engineer/`);
  },
};
</script>
 
 <style lang="scss" scoped>
</style>