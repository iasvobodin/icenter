<template>
  <div>
    ERRORID
    <h1>{{ $route.params.errorID }}</h1>
    <!-- {{error}} -->
  </div>
  <div v-for="(value, key, index) in error" :key="index">
     <p> {{key}} {{value}} </p> 
  </div>
</template>

<script>
export default {
  data() {
    return {
      error: null,
    };
  },
  methods: {
    async getUserErrors() {
        console.log(this.$route.params.errorID);
      try {
        const responsError = await fetch(
          `/api/errors/${this.$route.params.errorID}`
        );
        try {
          this.error = await responsError.json();
        } catch (error) {
          console.error("this.errors.json", error);
        }
      } catch (error) {
        console.log("errors is not def", error);
      }
    },
  },
  created() {
      this.getUserErrors()
  },
};
</script>

<style lang="scss" scoped></style>
