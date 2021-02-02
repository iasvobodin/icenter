<template>
  <h1>Admin Page With Auth</h1>
  <h2 v-if="payload">{{ payload }}</h2>
</template>

<script>
/* eslint-disable no-unused-vars */

import { ref } from "vue";
import { defineComponent } from "vue";

async function getUser() {
  const response = await fetch("/api/testfunc");
  const payload = await response.json();
  const { clientPrincipal } = payload;
  return clientPrincipal;
}

console.log(getUser(), "fromapi");

async function getUserInfo() {
  const response = await fetch("/.auth/me");
  const payload = await response.json();
  const { clientPrincipal } = payload;
  return clientPrincipal;
}
console.log(getUserInfo(), "promises");

export default {
  setup() {
    const payload = ref(null);
    async function getUserInfo() {
      const response = await fetch("/.auth/me");
      payload.value = await response.json();
      // const { clientPrincipal } = payload;
      // return clientPrincipal;
    }
    // const users = await getUserInfo();
    return { payload };
  }
};
</script>

<style lang="scss" scoped></style>
