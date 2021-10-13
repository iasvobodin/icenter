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
  width: min(800px, 95vw);
  margin: 2vw auto;
  padding: 2vw;
  box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 1px, rgba(0, 0, 0, 0.07) 0px 2px 2px,
    rgba(0, 0, 0, 0.07) 0px 4px 4px, rgba(0, 0, 0, 0.07) 0px 8px 8px,
    rgba(0, 0, 0, 0.07) 0px 16px 16px;
}
</style>
