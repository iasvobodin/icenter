<template>
  <div class="components__holder">
    <div v-if="state.task?.info" class="info__holder">
      <h2>Информация</h2>
      <info-render :info-data="state.task?.info" />
    </div>
    <div v-if="state.task && !timeToCalc">
      <h3>Время старта : {{ timeStartmod }}</h3>
      <h3 v-if="!timeToCalc">Время работы: {{ time }}</h3>
      <button @click="setStatePassedTime">Завершить работу</button>
      <button @click="updateInfo">Редактировать задачу</button>
    </div>

    <task-cab-time
      v-if="state.cabTime && timeToCalc"
      :input-data="state.cabTime"
      @cabtime-with-status="state.ctStatus = $event"
    />
    <task-status
      v-if="ctWithStatus.length !== 0"
      :input-data="ctWithStatus"
    />
    <teleport to="body">
      <confirm-popup
        :opened="state.popupOpened"
        @closed="popupClosed"
        @confirm="popupConfirmed"
      >
        <template #header>
          <h3>
            Выберите другой WO
            <br />для списания времени.
          </h3>
        </template>
        <template #select>
          <selectWO />
        </template>
      </confirm-popup>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import selectWO from '@/components/selectWO.vue'
import confirmPopup from '@/components/modal/cunfirmPopup.vue'
import { computed, onUnmounted, reactive } from 'vue'
import { useFetch } from '@/hooks/fetch'
import taskCabTime from '@/components/task/taskStatus.vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import infoRender from '@/components/infoRender.vue'
import { useStore } from 'vuex'
import taskStatus from '@/components/task/taskCalculate.vue'
import { taskType } from '@/types/taskType'
import { cabtimeType } from '@/types/cabtimeTypes'

const route = useRoute()
const store = useStore()
const state = reactive({
  popupOpened: false,
  cabTime: <cabtimeType>{},
  changeCabTime: false,
  task: <taskType>{},
  passedTime: 0,
  // timeToCalc: null,
  pps: null,
  ctStatus: null,
})
const setStatePassedTime = () => {
  store.commit('changePassedTime', Math.floor(state.passedTime! / 60000)) //- 24200)
  // console.log(store.state) //timeToCalc = state.passedTime
}

const formatDate = (date: Date) => {
  const options = <Intl.DateTimeFormatOptions>{
    hour12: false,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }
  const formatter = new Intl.DateTimeFormat('ru', options)
  console.log(formatter.format(date))

  return formatter.format(date)
}

const timeToCalc = computed(() => store.state.passedTime)

const timeStartmod = computed(() =>
  state.task?.body?.timeStart
    ? formatDate(new Date(state.task.body.timeStart))
    : 0
)

const ctWithStatus = computed(() =>
  store.state.cabtimeWithStatus.length !== 0
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    ? store.state.cabtimeWithStatus.sort((a, b) => {
        const x = a.status?.toLowerCase()
        const y = b.status?.toLowerCase()
        return x < y ? -1 : x > y ? 1 : 0
      })
    : []
)
function updateInfo() {
  state.popupOpened = !state.popupOpened
}

function popupClosed() {
  state.popupOpened = !state.popupOpened
}
function popupConfirmed() {
  
}

const CurrentTime = Date.now()

const time = computed(
  () =>
    state.passedTime
      ? new Date(state.passedTime).toISOString().substr(11, 8)
      : 0 // time like hors and minutes
)
// state.pps =
// const startTick = ()=>{
setInterval(() => {
  state.passedTime += 1000
  // console.log(state.passedTime)
}, 1000)
// }

//GET DB DATA
const { request: reqTask, response: resTask } = useFetch<taskType>(
  `/api/errors/${route.params.taskId}`
)

const getTask = async () => {
  try {
    await reqTask()
    state.task = resTask.value!
  } catch (error) {
    console.error(error)
  }

  // state.errors = response
  // state.projects = JSON.parse(JSON.stringify(state.errors))
}
const getCabTime = async () => {
  await getTask()
  const { request: reqCabTime, response: resCabTime } = useFetch<cabtimeType>(
    `/api/errors/cabtime__${state.task.info.wo}`
  )
  try {
    await reqCabTime()
    state.cabTime = resCabTime.value!
    state.task = resTask.value!
    state.passedTime = CurrentTime - state.task.body.timeStart
  } catch (error) {
    console.error(error)
  }

  // state.cabTime = resCabTime.value!
}
getCabTime()

onUnmounted(() => {
  store.commit('changePassedTime', 0)
  store.commit('setCabtimeWithStatus', null)
})
</script>

<style lang="css" scoped>
.components__holder {
  margin-bottom: 2vw;
}
h1 {
  cursor: pointer;
}
.info__holder {
  width: min(95vw, 800px);
  margin: 2vh auto;
}
</style>
