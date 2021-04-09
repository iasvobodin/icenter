<template>
  <div></div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
export default {
  setup() {
    const payload = ref(null);
    const state = ref(null);
    const router = useRouter();
    console.log(router, "this");

    fetch("/.auth/login/aad").then(() => router.push(`/`));

    // fetch("https://jsonplaceholder.typicode.com/users/1")
    //   .then(response => response.json())
    //   .then(json => {
    //     router.push(`/admin/${json.id}`);
    //     // state.value = json;
    //     // console.log(json);
    //   });

    return { payload, state };
  },
};
</script>

<style lang="scss" scoped></style>
