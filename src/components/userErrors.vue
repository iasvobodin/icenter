<template>
  <div v-for="(error, index) in errors" :key="index">
      <p>id {{ error.id }}</p>
      <p>статус {{ error.status }}</p>
      <p>проект {{ error["project number"] }}</p>
      <p>шкаф {{ error["cab name"] }}</p>
    </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
export default {
  async setup() {
    const errors = ref(null);
    const store = useStore();
    await store.dispatch("GET_auth");
    try {
      const responsErrors = await fetch(
        `/api/user/${window.sessionStorage.getItem("mail")}`
      );
      // try {
      errors.value = await responsErrors.json();
      // } catch (error) {
      // console.error("this.errors.json", error);
      // }
    } catch (error) {
      console.log("errors is not def", error);
    }

    return { errors };
  },
};
</script>

<style lang="scss" scoped></style>
