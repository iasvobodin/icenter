<template>
  <div>testPromise{{ props.testFlag }}</div>
  <input
    id=""
    :checked="item.status === 'done'"
    type="checkbox"
    name=""
    @input="changeStatus($event, 'done')"
  />
  <input
    id=""
    :checked="item.status === 'partially'"
    type="checkbox"
    name=""
    @input="changeStatus($event, 'partially')"
  />
</template>

<script setup>
import { reactive, toRefs, watch } from '@vue/runtime-core'

const props = defineProps({
  testFlag: {
    type: Boolean,
    required: true,
  },
})
const emit = defineEmits({
  promise: null,
})

const item = reactive({
  status: 'open',
  checked: false,
})
const changeStatus = (e, s) => {
  // item.checked = e.target.checked
  if (e.target.checked) {
    item.status = s
  } else {
    item.status = 'open'
  }
  console.log(e)
}
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
