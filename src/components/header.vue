<template>
    <div class="app__header">
<navigation-panel/>
    </div>
</template>

<script>
import navigationPanel from "@/components/adminNavigation.vue";
    export default {
          components: {
    navigationPanel
    }
    }
</script>

<style lang="css" scoped>
.app__header{
    height: 50px;
    width: 100%;
    background-color: rgb(0, 183, 255);
    position: fixed;
    top: 0;
}
</style>