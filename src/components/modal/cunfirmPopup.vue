<template>
  <div v-if="opened" role="dialog" class="popup">
    <div class="overlay" role="button" tabindex="0" @click="closed" />
    <div class="dialog">
      <div class="header">
        <slot name="header"></slot>
      </div>
      <div class="select">
        <slot name="select"></slot>
      </div>
      <div class="buttons">
        <slot name="buttons">
          <button class="cancel" @click="closed">Отмена</button>
          <button class="confirm" @click="confirm">Да</button>
        </slot>
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

const emit = defineEmits({
  confirm: null,
  closed: null,
})

const { opened } = toRefs(props)

const hendleKeyDown = (e: KeyboardEvent) => {
  opened.value && e.key === 'Escape' && closed()
}

const confirm = () => {
  emit('confirm', false)
}
const closed = () => {
  // opened.value = false
  emit('closed')
}

onMounted(() => {
  document.addEventListener('keydown', hendleKeyDown)
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', hendleKeyDown)
})
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
  /* grid-template-rows: 1fr 1fr; */
  place-self: center;
  position: relative;
  background-color: white;
  border-radius: 15px;
  min-width: 250px;
  min-height: 150px;
}
.select {
  /* position: absolute; */
  /* grid-area: 1/1/2/2; */
  /* max-height: 200px; */
}
.buttons {
  /* width: 90%; */
  display: grid;
  grid-auto-flow: column;
  margin: auto;
  min-height: 60px;
  align-content: center;
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
