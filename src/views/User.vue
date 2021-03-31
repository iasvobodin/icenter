<template>
  <div class="about">
    <h1>User page</h1>
    <h2 v-if="user">{{ user }}</h2>
  </div>
</template>

 <script>
export default {
  data() {
    return {
      user: null,
    };
  },
  mounted() {
    async function getUserInfo() {
      const response = await fetch("/.auth/me");
      const payload = await response.json();
      const { clientPrincipal } = payload;
      this.user = clientPrincipal.userDetails;
      return clientPrincipal;
    }

    console.log(getUserInfo());
  },
};
</script>
 
 <style lang="scss" scoped>
</style>