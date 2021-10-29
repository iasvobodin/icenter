<template>
  <div>
    <button @click="createTask">Приступить к работе</button>
  </div>
</template>

<script setup>
import { useFetch } from '@/hooks/fetch'
import { computed } from '@vue/reactivity'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

const route = useRoute()
const store = useStore()
const projectInfoState = computed(() => store.state.projectInfo)
const userInfoState = computed(() => store.state.user)

const createTask = async () => {
  const options = {
    method: 'post',
    body: JSON.stringify({
      id: `task__${Date.now()}`,
      info: {
        user: userInfoState.value.info.userDetails,
        userId: userInfoState.value.info.userId,
        Проект: projectInfoState.value['project number'],
        Шкаф: projectInfoState.value['cab name'],
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
  const { request, response } = useFetch('/api/post_item', options)
  await request()
}
</script>

<style lang="css" scoped></style>
