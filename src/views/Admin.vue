<template>
  <h1>Admin Page With Auth</h1>
  <!-- <Suspense>
    <h2>{{ payload }}</h2>
  </Suspense> -->
  <h3>{{ payload.userDetails }}</h3>
  <h2 v-for="item in state" :key="item.id">{{ item.body }}</h2>
</template>

<script>
/* eslint-disable no-unused-vars */

import { ref, onMounted } from "vue";
// import { defineComponent } from "vue";

// async function getUser() {
//   const response = await fetch("/api/testfunc");
//   const payload = await response.json();
//   const { clientPrincipal } = payload;
//   return clientPrincipal;
// }

// console.log(getUser(), "fromapi");

// async function getUserInfo() {
//   const response = await fetch("/.auth/me");
//   const payload = await response.json();
//   const { clientPrincipal } = payload;
//   return clientPrincipal;
// }
// console.log(getUserInfo(), "promises");

export default {
  setup() {
    const payload = ref(null);
    const state = ref(null);
    fetch("/.auth/me")
      .then(response => response.json())
      .then(data => {
        const { clientPrincipal } = data;
        payload.value = clientPrincipal;
      });
    // onMounted(async () => {
    //   const response = await fetch("/.auth/me");
    //   payload.value = await response.json();
    // });

    fetch("https://jsonplaceholder.typicode.com/posts")
      .then(response => response.json())
      .then(json => {
        state.value = json;
        console.log(json);
      });
    // async function getUserInfo() {
    //   const response = await fetch("/.auth/me");
    //   payload.value = await response.json();
    //   // const { clientPrincipal } = payload;
    //   // return clientPrincipal;
    // }
    // const users = await getUserInfo();
    return { payload, state };
  }
};
</script>

<style lang="scss" scoped></style>
