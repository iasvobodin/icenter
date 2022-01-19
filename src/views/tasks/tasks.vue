<template>
  <div>
    <!-- <delete-photos /> -->
    <!-- <test-promise :test-flag="state.ff" @promise="awaitPr($event)" /> -->
  </div>
</template>

<script setup lang="ts">
import deletePhotos from '@/components/deletePhotos.vue'
import testPromise from '@/components/testPromise.vue'
import { useFetch } from '@/hooks/fetch'
import { reactive, ref } from '@vue/reactivity'
import { taskType } from '@/types/taskType'

const state = reactive({
  ff: true,
  tasks: <taskType[]>{},
})
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
// getUserTask()
// const awaitPr = async (e) => {
//   console.log(e)
//   await e
//   console.log('await fucking promise')
// }
</script>

<style lang="scss" scoped></style>
