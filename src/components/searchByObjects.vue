<template>
  <input v-model="query" type="text" />
</template>

<script>
import { ref, computed } from 'vue'
export default {
  props: {
    dataForFilter: {
      type: Array,
      default: () => [],
    },
    keys: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const query = ref('')
    const filter = computed(() => {
      return
    })
    return { query }
  },
}
</script>

<style lang="scss" scoped>
</style>