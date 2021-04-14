<template>
  <div>
    <h1>{{ $route.params.errorID }}</h1>
  </div>
  <div v-for="(value, key, index) in error" :key="index">
    <p>{{ key }} {{ value }}</p>
  </div>
  <p v-if="errorIsNotDef">{{ errorIsNotDef }}</p>
</template>

<script>
export default {
  data() {
    return {
      error: null,
      errorIsNotDef: null,
    };
  },
  methods: {
    async getUserErrors() {
      // console.log(this.$route.params.errorID);
      try {
        const responsError = await fetch(
          `/api/errors/${this.$route.params.errorID}`
        );
        if (!responsError.ok) {
          this.errorIsNotDef = "Данной ошибки не существует";
          console.log("error is not exist");
        }
        try {
          this.error = await responsError.json();
        } catch (error) {
          console.error("this.errors.json", error.message);
        }
      } catch (error) {
        console.log("errors is not def", error);
      }
    },
  },
  created() {
    this.getUserErrors();
  },
};
</script>

<style lang="scss" scoped></style>
