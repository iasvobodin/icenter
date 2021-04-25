<template>
  <div class="errors__holder">
    <div
      v-for="(value, key, index) in errors"
      :key="index"
      class="errors__card"
      @click="chosseError(value.id)"
    >
      <div
        v-for="(val, key, index) in value.info"
        :key="index"
        class="error__item"
      >
        <h3 class="error__item__title">{{ key }}:</h3>
        <p class="error__item__desc">
          {{ val }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      errors: null,
    };
  },
  methods: {
    chosseError(e) {
      this.$router.push(`/errors/${e}`);
    },
    async getErrors() {
      const resErrors = await fetch(`/api/errors?status=${"open"}`);
      this.errors = await resErrors.json();
    },
  },
  created() {
    this.getErrors();
  },
};
</script>

<style lang="css" scoped>
.errors__holder {
  display: grid;
  /* width: 90%;
  margin: auto; */
  grid-template-columns: repeat(auto-fit, minmax(max(30vw, 300px), 1fr));
  column-gap: 2vh;
  row-gap: 2vh;
}
.errors__card {
  border: 1px solid orange;
  border-radius: 4px;
  padding: 5px;
  cursor: pointer;
}
.errors__card:hover {
  border: 1px solid black;
  background: rgba(245, 254, 255, 0.356);
}
.error__item {
  border-bottom: 1px solid black;
  padding: 2px;
  display: grid;
  grid-template-columns: 2fr 3fr;
}
.error__item__title {
  justify-self: start;
  align-self: center;
  text-align: start;
  margin: 0;
}
.error__item__desc {
  justify-self: end;
  text-align: end;
  align-self: center;
  margin: 0;
}
</style>
