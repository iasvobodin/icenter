<template>
  <h1>CabTimes</h1>
  <br />
  <br />
  <!-- <div class="selectStatus">
    <h3>Выберете статус ошибки   </h3>
    <select v-model="selectedStatus" class="change__status">
      <option value="open">Открыто</option>
      <option value="confirmed">Принято</option>
    </select>
  </div>-->
  <!-- <h3 class="search__title">Поиск</h3> -->
  <label for="search">Поиск:</label>
  <input
    id="search"
    v-model="state.search"
    class="choose"
    type="text"
    @keyup.enter="$event.target.blur()"
    placeholder="WO или номер проекта"
  />
  <br />
  <br />
  <div v-if="state.errors" class="errors__holder">
    <div
      v-for="(value, key, index) in filter"
      :key="index"
      class="item__card"
      @click="$router.push(`/cabtimes/${value.info.wo}`)"
    >
      <div
        v-for="(v, k, i) in value.info"
        :key="i"
        :class="{ cabtime__item__desc: k === 'Описание' }"
        class="cabtime__item"
      >
        <h3
          :class="{ cabtime__item__vertical__title: k === 'Описание' }"
          class="cabtime__item__title"
        >{{ k }}:</h3>
        <p
          :class="{ cabtime__item__vertical__title: k === 'Описание' }"
          class="cabtime__item__desc"
        >{{ v?.includes('@') ? v.split('@')[0].replace('.', ' ') : v }}</p>
      </div>
      <div class="cabtime__item">
        <h3 class="cabtime__item__title">Время</h3>
        <p class="cabtime__item__desc">{{ value.result.final }} ч.</p>
      </div>
      <!-- <p>Время {{ value.result.final }}</p> -->
    </div>
  </div>
  <!-- <div v-if="errorMessage">{{ errorMessage }}</div> -->
  <router-link to="/cabtimes/addnewcabtime">
    <img class="add__button" src="/img/add.svg" alt="Добавить новый CabTime" />
  </router-link>
</template>

<script setup>
import itemPhotoUploader from '@/components/itemPhotoUploader.vue'
import { reactive, computed, watch, ref } from 'vue'
import { useFetch } from '@/hooks/fetch'
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
// export default {

//   setup() {
const state = reactive({
  errors: null,
  phList: [],
  // resErrors: null,
  fetchStatus: null,
  // errorMessage: "",
})

const getCabTimesss = async () => {
  const { request, response } = useFetch(`/api/cabtimess`)
  await request()
  response.value.map(async (e, i) => {
    e.history = []
    const { request: postUpdateCabtime } = useFetch('/api/post_item', {
      method: 'post',
      body: JSON.stringify(e),
    })
    setTimeout(() => postUpdateCabtime(), 5000 * i)
  })


}
// getCabTimesss()

// const selectedStatus = ref('open')
const getCabTimes = async () => {
  const { request, response } = useFetch(`/api/cabTimes`)
  await request()
  state.errors = response

  // state.errors
  // .map(async (e) => {
  // e.id //currentCabtime

  // const { request: reqCurrentCabTime, response: resCurrentCabTime } =
  //   useFetch(`/api/GET_cabinet?wo=${state.errors[0].info.wo}&cabtimeid=${state.errors[0].id}`)
  // await reqCurrentCabTime()

  // const currentCabTime = resCurrentCabTime.value

  //     const { request: reqCurrentWO, response: resCurrentWO } =
  //       useFetch(`/api/getitembyid/${e.id}`,{method: 'post',body:JSON.stringify(...)})
  //     await reqCurrentWO()
  // })
}

getCabTimes()
// watch(selectedStatus, () => getCabTimes())

// onBeforeRouteUpdate(async (to, from) => {
//   if (from.contains('error')) {
//     alert('a')
//   }
// })
onBeforeRouteLeave((to, from) => {
  console.log(to, 'onBeforeRouteLeave')
  console.log(from, 'onBeforeRouteLeave')
})
const filter = computed(() => {
  return state.search
    ? state.errors.filter((e) =>
      [e?.info.wo, e?.info['Проект']].some(
        (s) => s && s.toLowerCase().includes(state.search.toLowerCase())
      )
    )
    : state.errors
})
// return {
//   selectedStatus,
//   ...toRefs(state),
// }
//   },
// };
</script>

<style lang="css" scoped>
/* .info{
  position: fixed;
  bottom: 20px;
  right: 80px;
  width: 40px;
  height: 40px;
  cursor: pointer;
} */
.search__title {
  width: auto;
}
input {
  height: 30px;
  border: 1px solid orange;
  border-radius: 5px;
  min-width: 250px;
  line-height: 30px;
  font-size: 18px;
  text-align: center;
  margin: auto;
  padding: 0px;
}
.button__holder {
  display: grid;
  grid-auto-flow: column;
  column-gap: 20px;
  position: fixed;
  bottom: 10px;
  right: 10px;
  width: 120px;
  height: 60px;
  cursor: pointer;
  background-color: white;
  border: 1px solid blue;
  padding: 10px;
  border-radius: 10px;
}
.button__holder > img {
  place-self: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
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
  grid-template-columns: repeat(auto-fill, minmax(max(25vw, 250px), 1fr));
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
.cabtime__item {
  border-bottom: 1px solid black;
  padding: 2px;
  display: grid;
  grid-template-columns: 2fr 3fr;
}
.cabtime__item__title {
  justify-self: start;
  align-self: center;
  text-align: start;
  margin: 0;
}
.cabtime__item__desc {
  height: inherit;
  display: block;
  justify-self: end;
  text-align: end;
  align-self: center;
  margin: 0;
  border-bottom: none;
}
.loading {
  margin: auto;
  width: 30px;
  height: 30px;
  background: url(/img/loading.gif) no-repeat center bottom;
}
.cabtime__desc {
  border-bottom: none;
  padding: 2px;
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr;
  border-bottom: none;
}
.cabtime__item__vertical__title {
  width: inherit;
  text-align: center;
  margin: 5px;
  white-space: pre-wrap;
  word-wrap: break-word;
}
.add__button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  cursor: pointer;
}
</style>
