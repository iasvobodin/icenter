<template>
  <div>testPromise{{ props.testFlag }}</div>
</template>

<script setup>
import { toRefs, watch } from '@vue/runtime-core'

const props = defineProps({
  testFlag: {
    type: Boolean,
    required: true,
  },
})
const emit = defineEmits({
  promise: null,
})

// const {testFlag} = toRefs(props)

watch(
  () => props.testFlag,
  (newV, oldV) => {
    emit(
      'promise',
      //     async () =>{
      //       setTimeout(() => {
      //     return 'foo'
      //   }, 5000);
      //     }
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve('foo')
        }, 3000)
      })
    )
  }
)
</script>

<style lang="css" scoped></style>
