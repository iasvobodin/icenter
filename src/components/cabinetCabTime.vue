<template>
    <div>
        <!-- <h1>BETTA VERSION</h1> -->
        <cab-time-view v-if="computedItems" :input-data="computedItems" :change-data="state.changeCabTime"/>
        <!-- {{cabtimes}} -->
        <router-link to="/cabtimes/addnewcabtime">
            <img class="add__button" src="/img/add.svg" alt="Добавить новый CabTime">
        </router-link>
        <br>
        <br>
        <button v-if="computedItems" @click="state.changeCabTime = !state.changeCabTime">Change</button>
                <br>
        <br>
    </div>
</template>

<script setup>
import CabTimeView from '@/components/CabTimeView.vue'
// import {reactive} from 'vue'
import { useFetch } from '@/hooks/fetch'
import {useStore} from 'vuex'
import {computed, reactive} from 'vue'
const store = useStore()
const state = reactive({
  cabTime : null,
  changeCabTime: false,
})
const computedItems = computed(()=> store.state.cabinetItems.filter(e => e.type === 'cabtime')[0])
// const cabtimes = computedItems.value.filter(e => e.type === 'cabtime')
// const getCabTime = async () => {
//       const {
//         request,
//         response
//       } = useFetch(`/api/errors/cabtime__${store.state.projectInfo.wo}`)
//       await request()
// state.cabTime = response
//       // state.errors = response
//       // state.projects = JSON.parse(JSON.stringify(state.errors))
// }
// getCabTime()
</script>

<style lang="css" scoped>
.add__button{
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  cursor: pointer;
}
</style>