<template>
  <div>
    <button v-if="computedItems" @click="createTask">
      Приступить к работе
    </button>
    <h3 v-else>CabTime по этому шкафу не расчитан.</h3>
    <h3 style="color: red">{{ delay }}</h3>
  </div>
</template>

<script setup lang="ts">
import { useFetch } from '@/hooks/fetch'
import { computed, reactive } from '@vue/reactivity'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { taskType } from '@/types/taskType'

const route = useRoute()
const router = useRouter()
const store = useStore()
const projectInfoState = computed(() => store.state.projectInfo)
const userInfoState = computed(() => store.state.user)

const computedItems = computed(() =>
  store.state.cabinetItems.filter((e) => e.type === 'cabtime')[0]
    ? store.state.cabinetItems.filter((e) => e.type === 'cabtime')[0]
    : null
)
const state = reactive({
  redirectMessage: '',
  second: 0,
})
const delay = computed(() =>
  state.redirectMessage
    ? `Необходимо остановить предыдущую задачу, переадресация через ${
        state.second / 1000
      } сек.`
    : ''
)
const id = `task__${Date.now()}`

const options = {
  method: 'post',
  body: JSON.stringify({
    id,
    info: {
      user: userInfoState.value.info.userDetails.toLowerCase(),
      userId: userInfoState.value.info.userId,
      'project number': projectInfoState.value['project number'],
      'cab name': projectInfoState.value['cab name'],
      wo: projectInfoState.value.wo.toString(),
    },
    type: 'task',
    status: 'active',
    body: {
      timeStart: Date.now(),
      timeEnd: null,
      timePassed: null,
      completeTask: [],
    },
  }),
}
const { request: postNewTask, response } = useFetch('/api/post_item', options)

const { request: reqUserTask, response: resUserActiveTask } =
  useFetch<taskType>(
    `/api/GET_userTasks?user=${userInfoState.value.info.userDetails.toLowerCase()}`
  )

const createTask = async () => {
  try {
    await reqUserTask()
    const userTask = resUserActiveTask.value
    console.log(userTask)
    debugger
    let delay = 5000
    state.second = delay
    setInterval(() => (state.second = delay -= 1000), 1000)
    state.redirectMessage = 'Необходимо остановить предыдущую задачу'
    setTimeout(() => router.push(`/tasks/${userTask!.id}`), delay)
  } catch (error) {
    try {
      await postNewTask()
      router.push(`/tasks/${id}`)
    } catch (error) {
      console.error(error, 'post userTask')
    }
  }
}
</script>

<style lang="css" scoped></style>
