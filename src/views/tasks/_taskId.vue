<template>
  <div class="components__holder">
    <task-cab-time v-if="state.cabTime" :input-data="state.cabTime" />
    <br />
    <br />
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useFetch } from '@/hooks/fetch'
import taskCabTime from '@/components/taskCabTime.vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'

const route = useRoute()

const state = reactive({
  cabTime: null,
  changeCabTime: false,
})

const getCabTime = async () => {
  const { request, response } = useFetch(
    `/api/errors/cabtime__${route.params.taskId}`
  )
  await request()
  state.cabTime = response
  // state.errors = response
  // state.projects = JSON.parse(JSON.stringify(state.errors))
}
getCabTime()
</script>

<style lang="css" scoped>
.components__holder {
  margin-bottom: 2vw;
}
h1 {
  cursor: pointer;
}
</style>
