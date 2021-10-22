<template>
  <div>
    <!-- <h1>BETTA VERSION</h1> -->
    <cab-time-view
      v-if="computedItems"
      :task-edit="state.taskEdit"
      :input-data="computedItems"
      :change-data="state.changeCabTime"
      :template-data="
        JSON.parse(JSON.stringify(store.state.template.CabTimeV3))
      "
      @final="em($event)"
    />
    <router-link
      v-if="
        !computedItems && $store.state.user.info.userRoles.includes('admin')
      "
      to="/cabtimes/addnewcabtime"
    >
      <img
        class="add__button"
        src="/img/add.svg"
        alt="Добавить новый CabTime"
      />
    </router-link>
    <br />
    <br />
    <button
      v-if="computedItems && $store.state.user.info.userRoles.includes('admin')"
      @click="state.changeCabTime = !state.changeCabTime"
    >
      {{ state.changeCabTime ? 'Cancel' : 'Change' }}
    </button>
    <button v-if="state.changeCabTime" @click="postCabTime">Save</button>
    <button
      v-if="$store.state.user.info.userRoles.includes('admin')"
      @click="state.taskEdit = !state.taskEdit"
    >
      TestTask
    </button>
    <br />
    <br />
  </div>
</template>

<script setup>
import CabTimeView from '@/components/CabTimeView.vue'
import { useFetch } from '@/hooks/fetch'
import { useStore } from 'vuex'
import { computed, reactive } from 'vue'
import { useRoute } from 'vue-router'
const store = useStore()
const state = reactive({
  cabTime: null,
  changeCabTime: false,
  taskEdit: false,
})
const route = useRoute()

const computedItems = computed(
  () => store.state.cabinetItems.filter((e) => e.type === 'cabtime')[0]
)
const em = (e) => (state.cabTime = e)

const postCabTime = async () => {
  const { request } = useFetch('/api/post_item', {
    method: 'POST', // или 'PUT'
    body: JSON.stringify({
      ...state.cabTime,
    }),
  })
  await request()
  await store.dispatch('getCabinetsInfo', route.params.cabinetId)
  await store.dispatch('GET_cabinetItems', route.params.cabinetId)
  state.changeCabTime = !state.changeCabTime
}
</script>

<style lang="css" scoped>
.add__button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  cursor: pointer;
}
</style>
