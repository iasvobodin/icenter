<template>
    <div>
        <h1>BETTA VERSION</h1>
        {{cabtimes}}
        <router-link to="/cabtimes/addnewcabtime">
            <img class="add__button" src="/img/add.svg" alt="Добавить новый CabTime">
        </router-link>
    </div>
</template>

<script setup>
import {useStore} from 'vuex'
import {computed} from 'vue'
const store = useStore()
const computedItems = computed(()=> store.state.cabinetItems)
const cabtimes = computedItems.value.filter(e => e.type === 'cabtime')
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