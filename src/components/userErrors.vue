<template>
  <!-- <div v-for="(error, index) in errors" :key="index">
      <p>id {{ error.id }}</p>
      <p>статус {{ error.status }}</p>
      <p>проект {{ error["project number"] }}</p>
      <p>шкаф {{ error["cab name"] }}</p>
    </div> -->
  <div v-if="errors" class="errors__holder">
    <div
      v-for="(value, key, index) in errors"
      :key="index"
      class="errors__card"
      @click="chosseError(value.id)"
    >
      <div class="error__item">
        <h3 class="error__item__title">Статус</h3>
        <p class="error__item__desc">
          {{ value.status }}
        </p>
      </div>
      <div class="error__item">
        <h3 class="error__item__title">Проект</h3>
        <p class="error__item__desc">
          {{ value['project number'] }}
        </p>
      </div>
      <div class="error__item">
        <h3 class="error__item__title">Шкаф</h3>
        <p class="error__item__desc">
          {{ value['cab name'] }}
        </p>
      </div>
      <div class="error__item__vertical">
        <h3 class="error__item__vertical__title">Описание</h3>
        <p class="error__item__vertical__desc">
          {{ value['description'] }}
        </p>
      </div>
    </div>
  </div>
  <div v-else>Нет открытых ошибок</div>

  <table v-if="false" style="width: 100%">
    <tr style="border: solid 1px orange">
      <th>статус</th>
      <th>проект</th>
      <th>шкаф</th>
      <th>Описание</th>
    </tr>
    <tbody>
      <tr
        v-for="(value, key, index) in errors"
        :key="index"
        @click="chosseError(value.id)"
      >
        <td>{{ value.status }}</td>
        <td>{{ value['project number'] }}</td>
        <td>{{ value['cab name'] }}</td>
        <td>{{ value['description'] }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
export default {
  async setup() {
    const errors = ref(null)
    const store = useStore()
    console.log(
      window.localStorage.getItem('userDetails'),
      'window.localStorage.getItem;'
    )
    !window.localStorage.getItem('userDetails') &&
      (await store.dispatch('GET_auth'))
    try {
      const responsErrors = await fetch(
        `/api/user/${window.localStorage.getItem('userDetails')}`
      )
      // try {
      errors.value = await responsErrors.json()
      // } catch (error) {
      // console.error("this.errors.json", error);
      // }
    } catch (error) {
      console.log('errors is not def', error)
    }

    return { errors }
  },
  methods: {
    chosseError(e) {
      this.$router.push(`/errors/${e}`)
    },
  },
}
</script>

<style lang="css">
.errors__holder {
  display: grid;
  /* width: 90%;
  margin: auto; */
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
.error__item__vertical__title {
  margin: 5px;
}
.error__item__vertical__desc {
  padding: 5px;
  text-align: start;
}
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
