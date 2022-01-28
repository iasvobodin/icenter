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
      <div class="popup__buttons">
        <slot name="buttons">
          <button class="popup__cancel__button" @click="closed">Отмена</button>
          <button class="popup__confirm__button" @click="confirm">Да</button>
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
  width: min(500px, 95vw);
  min-height: 150px;
}
.select {
  /* position: absolute; */
  /* grid-area: 1/1/2/2; */
  /* max-height: 200px; */
}

.header {
  text-align: center;
}

.popup__buttons {
  /* width: 90%; */
  display: grid;
  grid-auto-flow: column;
  margin: auto;
  min-height: 60px;
  align-content: center;
}
</style>

<style>
.popup__cancel__button:hover {
  background-color: rgba(0, 128, 0, 0.4);
}
.popup__confirm__button:hover {
  background-color: rgba(255, 0, 0, 0.4);
}
.popup__cancel__button {
  min-width: 100px;
  width: fit-content;
  border: 1px solid green;
}
.popup__confirm__button {
  min-width: 100px;
  width: fit-content;
  border: 1px solid red;
}
</style>