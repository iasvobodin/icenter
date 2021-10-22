<template>
  <div>
    <button>Приступить к работе</button>
  </div>
</template>

<script setup>
import { useFetch } from '@/hooks/fetch'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

const route = useRoute()
const store = useStore()
const createTask = async () => {
  const options = {
    method: 'post',
  }
  const { request, response } = useFetch()
}
</script>

<style lang="css" scoped></style>
