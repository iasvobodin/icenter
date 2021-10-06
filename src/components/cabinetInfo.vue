<template>
    <div class="info">
        <info-render :info-data="$store.state.projectInfo" />
    </div>
</template>

<script setup>
import infoRender from '@/components/infoRender.vue'
</script>

<style lang="css" scoped>
.info{
    width: min(1200px, 95vw);
    margin: auto;
}
</style>