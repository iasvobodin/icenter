<template>
  <div class="selectStatus">
    <h3>Выберете статус</h3>
    <select class="change__status" v-model="selectedStatus">
      <option value="open">Открыто</option>
      <option value="confirmed">Принято</option>
    </select>
    <br />
    <button class="update__button" @click="getErrors">Обновить</button>
  </div>
  <br />
  <div v-if="errors" class="errors__holder">
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
  <div v-if="errorMessage">{{errorMessage}}</div>
  <div v-if="fetchStatus" class="loading" />
</template>

<script>
export default {
  data() {
    return {
      errors: null,
      selectedStatus: "open",
      resErrors: null,
      fetchStatus: null,
      errorMessage:""
    };
  },
  methods: {
    chosseError(e) {
      this.$router.push(`/errors/${e}`);
    },
    async getErrors() {
      this.fetchStatus = true
      this.errors = null;
       this.errorMessage = ""
      try {
        this.resErrors = await fetch(
          `/api/errors?status=${this.selectedStatus}`
        );
        this.errors = await this.resErrors.json();
      } catch (error) {
        this.errorMessage = "Нет ошибок с выбранным статусом"
      } finally{
        this.fetchStatus = false
      }

      // const resErrors = await fetch(
      //   `/api/errors?status=${this.selectedStatus}`
      // );
      // this.errors = await resErrors.json();
      // if (resErrors.status === "210") {

      // }
    },
  },
  created() {
    this.getErrors();
  },
};
</script>

<style lang="css" scoped>
.change__status {
  width: min(400px, 95vw);
}
.update__button {
  margin-top: 1vh;
}
.errors__holder {
  display: grid;
  width: 98%;
  margin: auto;
  grid-template-columns: repeat(auto-fit, minmax(max(25vw, 250px), 1fr));
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
.loading {
  margin: auto;
  width: 30px;
  height: 30px;
  background: url(/img/loading.gif) no-repeat center bottom;
}
</style>
