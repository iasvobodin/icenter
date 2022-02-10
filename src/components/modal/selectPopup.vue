<template>
  <div v-if="opened" role="dialog" class="popup">
    <div class="overlay" role="button" tabindex="0" @click="closed" />
    <div class="dialog">
      <div class="header">
        <slot></slot>
      </div>
      <div class="buttons">
        <button class="cancel" @click="closed">Отмена</button>
        <button class="confirm" @click="confirm">Да</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from '@vue/reactivity'
import { onBeforeUnmount, onMounted } from '@vue/runtime-core'

const props = defineProps({
  opened: {
    type: Boolean,
    default: () => false,
  },
})
const { opened } = toRefs(props)

const hendleKeyDown = (e: KeyboardEvent) => {
  opened.value && e.key === 'Escape' && closed()
}
onMounted(() => {
  document.addEventListener('keydown', hendleKeyDown)
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', hendleKeyDown)
})
const emit = defineEmits({
  confirm: null,
  closed: null,
})
const confirm = () => {
  emit('confirm', false)
}
const closed = () => {
  // opened.value = false
  emit('closed')
}
</script>

<style lang="css" scoped>
.popup {
  position: fixed;
  display: grid;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* padding: 36px; */
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  cursor: pointer;
}
.dialog {
  display: grid;
  grid-template-rows: 1fr 1fr;
  place-self: center;
  position: relative;
  background-color: white;
  border-radius: 15px;
  width: min(95vw, 400px);
  min-height: 150px;
}
.buttons {
  width: 90%;
  display: grid;
  grid-auto-flow: column;
  margin: auto;
}
.cancel:hover {
  background-color: rgba(0, 128, 0, 0.4);
}
.confirm:hover {
  background-color: rgba(255, 0, 0, 0.4);
}
.cancel {
  min-width: 100px;
  width: fit-content;
  border: 1px solid green;
}
.confirm {
  min-width: 100px;
  width: fit-content;
  border: 1px solid red;
}
.header {
  text-align: center;
}
</style>
