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
    <task-status v-if="ctWithStatus.length !== 0" :input-data="ctWithStatus" />
    <teleport to="body">
      <confirm-popup :opened="state.popupOpened" @closed="popupClosed" @confirm="popupConfirmed">
        <template #header>
          <h3>
            Выберите другой WO
            <br />для списания времени.
          </h3>
        </template>
        <template #select>
          <selectWO @selected-wo="emitAlteredWo" />
          <p class="error">{{ state.errorMessage }}</p>
          <div class="advanced">
            <p>
              Изменить пространтсво и время
              <br />
              <small>(только для опытных пользователей)</small>
            </p>
            <input v-model="state.alteredTime" placeholder="время работы в минутах" type="number" />
          </div>
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
import { cabinetsType } from '@/types/cabinetsType'

const route = useRoute()
const store = useStore()
const state = reactive({
  errorMessage: '',
  popupOpened: false,
  cabTime: <cabtimeType>{},
  changeCabTime: false,
  task: <taskType>{},
  passedTime: 0,
  alteredWO: '',
  alteredTime: '',
  // timeToCalc: null,
  pps: null,
  ctStatus: null,
})

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
}


const getCabTime = async (wo: string) => {
  !state.task && await getTask()
  const { request: reqCabTime, response: resCabTime } = useFetch<cabtimeType>(
    `/api/errors/cabtime__${wo}`
  )
  try {
    await reqCabTime()
    state.cabTime = resCabTime.value!
    // state.task = resTask.value!
    state.passedTime = CurrentTime - state.task.body.timeStart
    return resCabTime.value
  } catch (error) {
    console.error(error)
    return false
  }
}

const getData = async () => {
  await getTask()
  await getCabTime(state.task.info.wo)
}
getData()
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


const emitAlteredWo = async (e: string) => {

  if (!await getCabTime(e)) {
    state.errorMessage = 'По данному WO не расчитан CabTime, \n изменения не сохранятся.'
    return
  } else {
    state.errorMessage = ''
    state.alteredWO = e
  }
}

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
async function popupConfirmed() {
  const { request: reqCabinets, response: resCabinets } =
    useFetch<cabinetsType>(`/api/GET_cabinetById?id=${state.alteredWO}`)
  if (state.alteredWO) {
    await reqCabinets()
    let ttl;
    if (resCabinets.value) {
      //CHECK CABTIME
      // const { request, response: cabtime } = useFetch(`/api/cabinetItems?wo=${state.alteredWO}&cabtime=true`)
      // await request()
      // // console.log(response.value);

      // if (!cabtime.value) {
      //   state.errorMessage = 'по данному WO нет CabTime'
      //   return
      // }

      //DELETE CURRENT TASK
      const del = {
        method: 'post',
        body: JSON.stringify({ id: state.task.id, ttl: 1, info: { wo: state.task.info.wo } }),
      }
      const { request: deleteTask, response } = useFetch('/api/post_item', del)
      await deleteTask()

      //UPDATE CURRENT TASK

      state.task.info.wo = resCabinets.value.info.wo
      state.task.info['project number'] = resCabinets.value.info['project number']
      state.task.info['cab name'] = resCabinets.value.info['cab name']


    }
  }
  if (state.alteredTime) {
    state.task.body.timeStart = Date.now() - +state.alteredTime * 60000
    state.passedTime = +state.alteredTime * 60000
  }
  const options = {
    method: 'post',
    body: JSON.stringify(state.task),
  }
  delete state.task.ttl

  const { request: postUpdatedTask } = useFetch('/api/post_item', options)
  await postUpdatedTask()


  state.popupOpened = false;
  // console.log(resCabinets.value);

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


const saveTask = async () => {
  //get actual cabtime
  const actualCabtime = await getCabTime(state.task.info.wo)
  //push history in cabtime
  actualCabtime && actualCabtime.history?.push(...store.state.cabtimeWithStatus)
  //save task

  //save cabtime
}

onUnmounted(() => {
  store.commit('changePassedTime', 0)
  store.commit('setCabtimeWithStatus', [])
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
.advanced {
  display: grid;
}
.advanced p {
  text-align: center;
  margin: 10px;
  font-size: var(--size-500);
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
.error {
  color: red;
  text-align: center;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
