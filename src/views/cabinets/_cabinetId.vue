<template>
  <div>
    <div v-if="pInfo">
      <h2>
        <span>№ :</span>
        {{ pInfo['project number'] }}
      </h2>
      <h2>
        <span>Проект :</span>
        {{ pInfo['Project Name'] }}
      </h2>

      <h2>
        <span>Шкаф :</span>
        {{ pInfo['cab name'] }}
      </h2>
      <h2>
        <span>WO :</span>
        {{ $route.params.cabinetId }}
      </h2>
    </div>
    <!-- <h1>WO {{ $route.params.cabinetId }}</h1> -->
    <br />
    <button
      v-for="tab in state.cabinetTabs"
      :key="tab.title"
      class="cabinets__category"
      :class="['tab-button', { active: state.currentCabinetTab === tab.title }]"
      @click="state.currentCabinetTab = tab.title"
    >{{ tab.title }}</button>
    <br />
    <br />
    <component :is="condition(state.currentCabinetTab)"></component>
  </div>
</template>

<script setup lang="ts">
import { useFetch } from '@/hooks/fetch'
import { reactive, computed, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import Errors from '@/components/cabinetErrors.vue'
import Cabtime from '@/components/cabinetCabTime.vue'
import Info from '@/components/cabinetInfo.vue'
import Tasks from '@/components/cabinetTasks.vue'
// import { cabinetInfo } from '@/types/cabinetsType'
import { useStore } from 'vuex'

type cabinetInfo = {
  "id": string,
  "type": string,
  "info": {
    "wo": string,
    "cab name": string,
    "project number": string,
    "Project Name": string,
    "status": string
  },
}
const route = useRoute()
const store = useStore()
const state = reactive({
  cabinetInfo: <cabinetInfo | null>null,
  cabinetItems: null,
  cabinetTabs: [
    { title: 'Информация' },
    { title: 'CabTime' },
    { title: 'Ошибки' },
    // { title: 'Задачи' },
  ],
  currentCabinetTab: '',
})

const getCabinetInfo = async () => {
  // try {
  const { request: reqCabinetInfo, response: resCabinetInfo } = useFetch<cabinetInfo>(
    `/api/getitembyid/info__${route.params.cabinetId}`
  )
  await reqCabinetInfo()
  state.cabinetInfo = resCabinetInfo.value!
}

const setState = async () => {
  // await store.dispatch('getCabinetsInfo', route.params.cabinetId)
  // await getCabinetInfo()
  store.commit('SETcurrentProject', route.params.cabinetId)
  await store.dispatch('GET_cabinetItems', route.params.cabinetId)
}
setState()

const pInfo = computed(() => store.state.cabinetInfo ? store.state.cabinetInfo.info : null)





const condition = (a: string) => {
  switch (a) {
    case 'Информация':
      return Info
    case 'CabTime':
      return Cabtime
    case 'Ошибки':
      return Errors
    case 'Задачи':
      return Tasks
    default:
      return Info
  }
}
</script>

<style lang="css" scoped>
.cabinets__category {
  min-width: 20%;
  cursor: pointer;
  margin-bottom: 10px;
}
.tab-button.active {
  background: #0066ff1f;
}
[type="radio"] {
  display: none;
}

small {
  /* border-style: solid;
    border-width: 3px; */
  border-radius: 5px;
  padding: 3px;
  color: white;
}

label {
  border: 1px solid orange;
  position: relative;
  /* border-bottom: 0px solid orange; */
  padding: 5px;
  cursor: pointer;
  /* border-radius: 4px; */
  border-radius: 5px 5px 0 0;
  background-color: rgba(255, 183, 157, 0.13);
  display: block;
  width: 100%;
}

[type="radio"]:checked ~ label {
  background: white;
  background-color: rgb(255, 255, 255);
  /* color: aliceblue; */
  border-bottom: 1px solid white;
  /* z-index: 2; */
}

.card__holder {
  margin-top: 0px;
  padding: 15px;
  border-radius: 0 0 5px 5px;
  border: 1px solid orange;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
}

.err__tab {
  place-self: stretch;
}

.err__tabs {
  display: grid;
  grid-auto-flow: column;
  column-gap: 10px;
  /* width: 100%; */
  margin: auto;
  margin-bottom: -1px;
}

.error__holder {
  border-bottom: 1px solid black;
  /* border-radius:4px; */
  width: min(1200px, 95vw);
  margin: auto;
  margin-top: 1vh;
  padding-bottom: 1vh;
}
h2 span {
  font-size: 80%;
  vertical-align: middle;
}
</style>
