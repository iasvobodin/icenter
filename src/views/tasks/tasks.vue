<template>
  <div>
    <br />FROM
    <input v-model="state.date" type="date" />
    <!-- {{ Date.parse(state.date) / 1000 }} -->
    <br />
    <br />TO
    <input v-model="state.date2" type="date" />
    <!-- {{ new Date(state.date2) }} -->
    <br />
    <br />
    <button @click="getTasks">Запрос</button>
    <!-- <button @click="updateTasks">Update</button> -->
    <!-- <delete-photos /> -->
    <!-- <test-promise :test-flag="state.ff" @promise="awaitPr($event)" /> -->
    <div v-if="state.tasks">
      <div v-for="task in state.tasks" :key="task.id">
        <task-card v-if="state.tasks" :user-task="task" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import taskCard from '@/components/task/taskCard.vue'
import deletePhotos from '@/components/deletePhotos.vue'
import testPromise from '@/components/testPromise.vue'
import { useFetch } from '@/hooks/fetch'
import { reactive, ref } from '@vue/reactivity'
import { taskType } from '@/types/taskType'

const state = reactive({
  ff: true,
  tasks: <taskType[] | null>null,
  date: "",
  date2: ""
})
// 
const getTasks = async () => {
  const { request: reqTasks, response: resTasks } = useFetch<taskType[]>(`/api/tasksByTyme?from=${new Date(state.date).toISOString()}&to=${new Date(state.date2).toISOString()}`)
  await reqTasks()
  state.tasks = resTasks.value!
}
const getUserTask = async () => {
  const { request, response } = useFetch<taskType[]>(
    `/api/GET_userTasks?all=true&user=true`
  )
  try {
    await request()
    state.tasks = response.value!
  } catch (error) {
    console.log(error)
  }
}
const updateTasks = async () => {
  state.tasks!.map(async e => {
    e.body.timeStartUTC = new Date(e.body.timeStart).toISOString()
    const { request: postUpdateTask } = useFetch('/api/post_item', {
      method: 'post',
      body: JSON.stringify(e),
    })
    await postUpdateTask()

  })
}

// getUserTask()
// const awaitPr = async (e) => {
//   console.log(e)
//   await e
//   console.log('await fucking promise')
// }
</script>

<style lang="scss" scoped></style>
