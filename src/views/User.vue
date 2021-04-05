<template>
  <div class="about">
    <h1>User page</h1>
    <h2 v-if="user">{{ user.id }} {{ user.data }}</h2>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: null
    };
  },
  async mounted() {
    const response = await fetch("/.auth/me");
    const payload = await response.json();
    const { clientPrincipal } = payload;

    // let clientPrincipal = {
    //   id: "1298"
    // };

    const user = await fetch(`/api/user/${clientPrincipal.userId}`, {
      method: "POST", // или 'PUT'
      body: JSON.stringify({
        id: clientPrincipal.userId,
        mail: clientPrincipal.userDetails,
        data: "bigdata999"
      })
    });
    const userData = await user.json();
    console.log(userData, "userData");

    this.user = userData[0];
    // this.user.userRoles.includes("admin") && this.$router.push(`/admin/`);
    // this.user.userRoles.includes("fitter") && this.$router.push(`/fitter/`);
    // this.user.userRoles.includes("engineer") && this.$router.push(`/engineer/`);
  }
};
</script>

<style lang="scss" scoped></style>
