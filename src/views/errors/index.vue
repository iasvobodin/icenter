<template>
  <router-link to="/errors/addnew">Добавить новую ошибку</router-link>
  <br />
  <br />
  <div class="selectStatus">
    <h3>Выберете статус ошибки</h3>
    <select v-model="selectedStatus" class="change__status">
      <option value="open">Открыто</option>
      <option value="confirmed">Принято</option>
    </select>
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
        v-for="(v, k, i) in value.info"
        :key="i"
        class="error__item"
      >
        <h3 class="error__item__title">{{ k }}:</h3>
        <p class="error__item__desc">
          {{ v }}
        </p>
      </div>
    </div>
  </div>
  <div v-if="errorMessage">{{ errorMessage }}</div>
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
      errorMessage: "",
    };
  },
  watch: {
    selectedStatus() {
      this.getErrors();
    },
  },
  created() {
    this.getErrors();
  },
  methods: {
    chosseError(e) {
      this.$router.push(`/errors/${e}`);
    },
    async getErrors() {
      this.fetchStatus = true;
      this.errors = null;
      this.errorMessage = "";
      try {
        this.resErrors = await fetch(
          `/api/errors?status=${this.selectedStatus}`
        );
        this.errors = await this.resErrors.json();
      } catch (error) {
        this.errorMessage = "Нет ошибок с выбранным статусом";
      } finally {
        this.fetchStatus = false;
      }
    },
  },
};
</script>

<style lang="css" scoped>
.selectStatus > h3 {
  display: inline;
}
.change__status {
  width: auto;
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
