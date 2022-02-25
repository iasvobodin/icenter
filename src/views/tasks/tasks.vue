<template>
  <div>
    <br />FROM
    <input v-model="state.dateFrom" type="date" />
    <!-- {{ Date.parse(state.date) / 1000 }} -->
    <br />
    <br />TO
    <input v-model="state.dateTo" type="date" />
    <!-- {{ new Date(state.date2) }} -->
    <br />
    <br />
    <button @click="getTasks">Запрос</button>
    <div v-if="state.tasks" class="tasks">
      <div v-for="task in state.tasks" :key="task.id">
        <task-card v-if="state.tasks" :user-task="task" />
      </div>
    </div>
  </div>
  <button @click="getErrors">geterrors</button>
  <button @click="updateElements">updateerrors</button>
</template>

<script setup lang="ts">
import taskCard from '@/components/task/taskCard.vue'
import { useFetch } from '@/hooks/fetch'
import { reactive, ref } from '@vue/reactivity'
import { taskType } from '@/types/taskType'
import { errorType } from '@/types/errorType'

const state = reactive({
  tasks: <taskType[] | null>null,
  errors: <errorType[] | null>null,
  dateFrom: "",
  dateTo: ""
})
// 
const getTasks = async () => {
  const { request: reqTasks, response: resTasks } = useFetch<taskType[]>(`/api/tasksByTyme?from=${new Date(state.dateFrom).toISOString()}&to=${new Date(state.dateTo).toISOString()}`)
  await reqTasks()
  state.tasks = resTasks.value!
}
const getErrors = async () => {
  const { request, response } = useFetch<errorType[]>(
    `/api/errors`
  )
  try {
    await request()
    state.errors = response.value!
  } catch (error) {
    console.log(error)
  }
}
const updateElements = async () => {
  state.errors!.map(async e => {
    // e.id.split('__')[1]
    e._createUTC = new Date(+e.id.split('__')[1]).toISOString()
    const { request: postUpdateTask } = useFetch('/api/post_item', {
      method: 'post',
      body: JSON.stringify(e),
    })
    await postUpdateTask()

  })
}

</script>

<style  scoped>
.tasks {
  display: grid;
  width: 98%;
  margin: auto;
  grid-template-columns: repeat(auto-fill, minmax(max(19vw, 250px), 1fr));
  column-gap: 1vw;
  row-gap: 1vh;
}
</style>
