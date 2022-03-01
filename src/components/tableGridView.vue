<template>
    <div class="ddiv">
        <label class="llable">
            <input v-model="view" type="radio" class="iinput" value="table" name="viewType" checked />
            <span class="sspan" :class="{ activetable: view === 'table' }"></span>
        </label>
        <label class="llable">
            <input v-model="view" type="radio" class="iinput" value="grid" name="viewType" />
            <span class="sspan2" :class="{ activegrid: view === 'grid' }"></span>
        </label>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';


const view = ref('grid')

const emit = defineEmits({
    view: null
})

watch(view, (newV, oldV) => {
    emit('view', newV)
})


</script>

<style>
.ddiv {
    font-size: 0.8em;
    color: #2b2b2b;
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;
    display: flex;
    line-height: 28px;
    justify-content: flex-end;
    width: 95%;
    margin: auto;
}
.llable {
    color: #2b2b2b;
    -webkit-font-smoothing: antialiased;
    line-height: 28px;
    display: inline-block;
    margin: 0 -1px 0 0;
    user-select: none;
    text-align: center;
    outline: 0;
    touch-action: manipulation;
    cursor: pointer;
    position: relative;
    background-position: 6px 1px;
    background-repeat: no-repeat;
}
.iinput {
    -webkit-font-smoothing: antialiased;
    user-select: none;
    box-sizing: border-box;
    /* font-family: Arial, Helvetica, sans-serif; */
    position: absolute;
    cursor: pointer;
    opacity: 0;
}
.sspan {
    /* font: 0.8em YS Text, Arial, Helvetica, sans-serif; */
    color: #2b2b2b;
    -webkit-font-smoothing: antialiased;
    line-height: 28px;
    user-select: none;
    text-align: center;
    cursor: pointer;
    box-sizing: border-box;
    position: relative;
    background-position: 6px 1px;
    background-repeat: no-repeat;
    /* z-index: 1; */
    padding: 0 1em;
    pointer-events: none;
    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMyIgaGVpZ2h0PSIxMyIgZmlsbD0iI2IyYjJiMiI+PHBhdGggZD0iTTAgMTBoM3YzSDB6bTUgMGg4djNINXpNMCA1aDN2M0gwem01IDBoOHYzSDV6TTAgMGgzdjNIMHptNSAwaDh2M0g1eiIvPjwvc3ZnPg==);
}
.sspan2 {
    /* font: 0.8em YS Text, Arial, Helvetica, sans-serif; */
    color: #2b2b2b;
    -webkit-font-smoothing: antialiased;
    line-height: 28px;
    user-select: none;
    text-align: center;
    cursor: pointer;
    box-sizing: border-box;
    position: relative;
    background-position: 6px 1px;
    background-repeat: no-repeat;
    /* z-index: 1; */
    padding: 0 1em;
    pointer-events: none;
    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMyIgaGVpZ2h0PSIxMyIgZmlsbD0iI2IyYjJiMiI+PHBhdGggZD0iTTAgMGg2djZIMHptNyAwaDZ2Nkg3em0wIDdoNnY2SDd6TTAgN2g2djZIMHoiLz48L3N2Zz4=);
}

.activegrid {
    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMyIgaGVpZ2h0PSIxMyIgZmlsbD0iIzJiMmIyYiI+PHBhdGggZD0iTTAgMGg2djZIMHptNyAwaDZ2Nkg3em0wIDdoNnY2SDd6TTAgN2g2djZIMHoiLz48L3N2Zz4=);
}
.activetable {
    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMyIgaGVpZ2h0PSIxMyIgZmlsbD0iIzJiMmIyYiI+PHBhdGggZD0iTTAgMTBoM3YzSDB6bTUgMGg4djNINXpNMCA1aDN2M0gwem01IDBoOHYzSDV6TTAgMGgzdjNIMHptNSAwaDh2M0g1eiIvPjwvc3ZnPg==);
}
</style>