<template>
  <div class="components__holder">
    <div v-if="state.task" class="info__holder">
      <h2>Информация</h2>
      <info-render :info-data="state.task.info" />
    </div>
    <div v-if="state.task && !timeToCalc">
      <h3>
        Время старта : {{ formatDate(new Date(state.task.body.timeStart)) }}
      </h3>
      <h3 v-if="!timeToCalc">Время работы: {{ time }}</h3>
      <button @click="setStatePassedTime">Завершить работу</button>
      <button @click="setStatePassedTime">Редактировать задачу</button>
    </div>

    <task-cab-time
      v-if="state.cabTime && timeToCalc"
      :input-data="state.cabTime"
      @cabtime-with-status="state.ctStatus = $event"
    />
    <task-status v-if="ctWithStatus" :input-data="{ body: ctWithStatus }" />
  </div>
</template>

<script setup>
import { computed, onUnmounted, reactive } from 'vue'
import { useFetch } from '@/hooks/fetch'
import taskCabTime from '@/components/taskCabTime.vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import infoRender from '@/components/infoRender.vue'
import { useStore } from 'vuex'
import taskStatus from '@/components/task/taskStatus.vue'

const route = useRoute()
const store = useStore()
const state = reactive({
  cabTime: null,
  changeCabTime: false,
  task: null,
  passedTime: null,
  // timeToCalc: null,
  pps: null,
  ctStatus: null,
})
const setStatePassedTime = () => {
  store.commit('changePassedTime', Math.floor(state.passedTime / 60000)) //- 24200)
  // console.log(store.state) //timeToCalc = state.passedTime
}

const timeToCalc = computed(() => store.state.passedTime)

const ctWithStatus = computed(() =>
  store.state.cabtimeWithStatus
    ? store.state.cabtimeWithStatus.sort((a, b) => {
        const x = a.status?.toLowerCase()
        const y = b.status?.toLowerCase()
        return x < y ? -1 : x > y ? 1 : 0
      })
    : null
)

const getTask = async () => {
  const { request, response } = useFetch(`/api/errors/${route.params.taskId}`)
  await request()
  state.task = response
  // state.errors = response
  // state.projects = JSON.parse(JSON.stringify(state.errors))
}
const CurrentTime = Date.now()
const time = computed(
  () => new Date(state.passedTime).toISOString().substr(11, 8) // time like hors and minutes
)
// state.pps =
// const startTick = ()=>{
setInterval(() => {
  state.passedTime += 1000
  // console.log(state.passedTime)
}, 1000)
// }

const formatDate = (date) => {
  const options = {
    hour12: false,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }
  const formatter = new Intl.DateTimeFormat('ru', options)

  return formatter.format(date)
  // return `0${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}
const getCabTime = async () => {
  await getTask()
  const { request, response } = useFetch(
    `/api/errors/cabtime__${state.task.info.wo}`
  )
  await request()
  state.cabTime = response

  state.passedTime = CurrentTime - state.task.body.timeStart
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
