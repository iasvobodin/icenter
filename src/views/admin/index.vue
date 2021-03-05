<template>
  <h1>Admin Page With Auth</h1>
  <!-- <Suspense>
    <h2>{{ payload }}</h2>
  </Suspense> -->
  <!-- <h3>{{ payload.userDetails }}</h3> -->
  <!-- <h2 v-for="item in state" :key="item.id">{{ item.body }}</h2> -->
</template>

<script>
/* eslint-disable no-unused-vars */

import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

export default {
  setup() {
    const payload = ref(null);
    const state = ref(null);
    const router = useRouter();
    console.log(router, "this");

    fetch("/.auth/me")
      .then(response => response.json())
      .then(data => {
        const { clientPrincipal } = data;
        router.push(`/admin/${clientPrincipal.userId}`);
      });

    // fetch("https://jsonplaceholder.typicode.com/users/1")
    //   .then(response => response.json())
    //   .then(json => {
    //     router.push(`/admin/${json.id}`);
    //     // state.value = json;
    //     // console.log(json);
    //   });

    return { payload, state };
  }
};
</script>

<style lang="scss" scoped></style>
