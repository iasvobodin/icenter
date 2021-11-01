<template>
  <div>
    <delete-photos />
    <!-- <test-promise @promise="awaitPr($event)" :test-flag="state.ff" /> -->
  </div>
</template>

<script setup>
import deletePhotos from '@/components/deletePhotos.vue'
import testPromise from '@/components/testPromise.vue'
import { reactive, ref } from '@vue/reactivity'

const state = reactive({
  ff: true,
})
const awaitPr = async (e) => {
  console.log(e)
  await e
  console.log('await fucking promise')
}
</script>

<style lang="scss" scoped></style>
