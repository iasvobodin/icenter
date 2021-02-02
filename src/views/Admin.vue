<template>
  <h1>Admin Page</h1>
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
    return {};
  }
};
</script>

<style lang="scss" scoped></style>
