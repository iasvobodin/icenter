<template>
  <h1>Admin Page With Auth</h1>
  <!-- <h2>{{ user.userDetails }}</h2> -->
</template>

<script>
async function getUserInfo() {
  const response = await fetch("/.auth/me");
  const payload = await response.json();
  const { clientPrincipal } = payload;
  return clientPrincipal;
}

console.log(getUserInfo());
export default {
  setup() {
    // async function getUserInfo() {
    //   const response = await fetch("/.auth/me");
    //   const payload = await response.json();
    //   const { clientPrincipal } = payload;
    //   return clientPrincipal;
    // }
    // const user = getUserInfo();
    return {};
  }
};
</script>

<style lang="scss" scoped></style>
