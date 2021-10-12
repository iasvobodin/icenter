<template>
  <div class="info">
    <info-render :info-data="pInfo" />
  </div>
</template>

<script setup>
import infoRender from '@/components/infoRender.vue'
import { computed } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const pInfo = computed(() =>
  store.state.projectInfo ? store.state.projectInfo : {}
)
</script>

<style lang="css" scoped>
.info {
  width: min(900px, 95vw);
  margin: auto;
}
</style>
