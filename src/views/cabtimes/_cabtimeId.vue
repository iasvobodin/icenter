<script setup>
import { ref, computed } from 'vue'

const color = ref('red')
</script>

<template>
  <button class="tttbotton" @click="color = color === 'red' ? 'green' : 'red'">
    Color is: {{ color }}
  </button>
</template>

<style>
.tttbotton {
  color: v-bind(color);
}
</style>