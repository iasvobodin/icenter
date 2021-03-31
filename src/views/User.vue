<template>
  <div class="about">
    <h1>User page</h1>
  </div>
</template>

 
 <script>
export default {
  mounted() {
    async function getUserInfo() {
      const response = await fetch("/.auth/me");
      const payload = await response.json();
      const { clientPrincipal } = payload;
      return clientPrincipal;
    }

    console.log(getUserInfo());
  },
};
</script>
 
 <style lang="scss" scoped>
</style>