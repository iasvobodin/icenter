<template>
  <!-- <div v-for="(error, index) in errors" :key="index">
      <p>id {{ error.id }}</p>
      <p>статус {{ error.status }}</p>
      <p>проект {{ error["project number"] }}</p>
      <p>шкаф {{ error["cab name"] }}</p>
    </div> -->
  <table v-if="errors" style="width: 100%">
    <tr style="border: solid 2px orange">
      <th>статус</th>
      <th>проект</th>
      <th>шкаф</th>
      <th>Описание</th>
    </tr>
    <tbody>
      <tr
        @click="chosseError(value.id)"
        v-for="(value, key, index) in errors"
        :key="index"
      >
        <td>{{ value.status }}</td>
        <td>{{ value["project number"] }}</td>
        <td>{{ value["cab name"] }}</td>
        <td>{{ value["description"] }}</td>
      </tr>
    </tbody>
  </table>
  <div v-else>Нет открытых ошибок</div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
export default {
  methods: {
    chosseError(e) {
      this.$router.push(`/errors/${e}`);
    },
  },
  async setup() {
    const errors = ref(null);
    const store = useStore();
    await store.dispatch("GET_auth");
    try {
      const responsErrors = await fetch(
        `/api/user/${window.sessionStorage.getItem("userDetails")}`
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

<style lang="css" scoped>
table {
  margin-top: 2vh;
  border-collapse: collapse;
  border-radius: 5px;
}
td {
  border: 1px solid rgb(0, 0, 0);
  padding: 0.5rem;
  font-size: 12px;
}
tbody tr:nth-child(odd) {
  background: #eee;
}
tbody tr:hover {
  background: rgba(255, 166, 0, 0.425);
}
tbody tr {
  cursor: pointer;
}
</style>
