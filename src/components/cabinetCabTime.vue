<template>
  <div>
    <!-- <h1>BETTA VERSION</h1> -->
    <cab-time-view
      v-if="state.cabTime"
      :task-edit="state.taskEdit"
      :input-data="state.cabTime"
      :show-history="true"
      :change-data="state.changeCabTime"
      :template-data="
        JSON.parse(JSON.stringify(store.state.template.CabTimeV3))
      "
    />
    <router-link
      v-if="
        !state.cabTime && $store.state.user.info.userRoles.includes('admin')
      "
      to="/cabtimes/addnewcabtime"
    >
      <img class="add__button" src="/img/add.svg" alt="Добавить новый CabTime" />
    </router-link>
    <!-- <br />
    <br />
    <button
      v-if="computedItems && $store.state.user.info.userRoles.includes('admin')"
      @click="$router.push(`/cabtimes/${$route.params.cabinetId}`)"
    >Редактировать</button>-->
  </div>
</template>

<script setup lang="ts">
import CabTimeView from '@/components/CabTimeView.vue'
import { useFetch } from '@/hooks/fetch'
import { useStore } from 'vuex'
import { computed, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { cabtimeType } from '@/types/cabtimeTypes'
const store = useStore()
const state = reactive({
  cabTime: <cabtimeType | null>null,
  changeCabTime: false,
  taskEdit: false,
})
const route = useRoute()

// const computedItems = computed(
//   () => store.state.cabinetItems!.filter((e): e is cabtimeType => e.type === 'cabTime')[0]
// )
// state.cabTime = typeof route.params.cabinetId === 'string' && getCabTime(route.params.cabinetId)

typeof route.params.cabinetId === 'string' && getCabTime(route.params.cabinetId)

async function getCabTime(wo: string) {
  // !state.task && (await getTask())
  const { request: reqCabTime, response: resCabTime } = useFetch<cabtimeType>(
    `/api/getitembyid/cabtime__${wo}`
  )
  try {
    await reqCabTime()
    // add history to cabtime
    resCabTime.value &&
      resCabTime.value.history &&
      resCabTime.value.history.length > 0 &&
      resCabTime.value.history.forEach((historyVersion) => {

        historyVersion.map((cabtimeBodyElement) => {

          const index = resCabTime.value?.body.findIndex(
            (e) => e._id === cabtimeBodyElement._id
          )
          resCabTime.value!.body[index!] = cabtimeBodyElement
        })
      })

    const filterBody = resCabTime.value!.body.reduce(
      (acc: cabtimeType['body'], e) => {
        // if (e.status !== 'done') {
        if (e.status === 'partially') {
          e.result -= e.propTime!
          e.fitter = ''
          e.date = 0
          e.status = 'open'
        }
        acc.push(e)
        // }
        return acc
      },
      []
    )


    const cabTimeWithHistory = {
      ...resCabTime.value!,
      body: filterBody,
    }
    // state.task = resTask.value!
    // state.passedTime = CurrentTime - state.task.body.timeStart
    state.cabTime = cabTimeWithHistory
    return cabTimeWithHistory
  } catch (error) {
    console.error(error)
    return null
  }
}
// const em = (e) => (state.cabTime = e)

// const postCabTime = async () => {
//   const { request } = useFetch('/api/post_item', {
//     method: 'POST', // или 'PUT'
//     body: JSON.stringify({
//       ...state.cabTime,
//     }),
//   })
//   await request()
//   await store.dispatch('getCabinetsInfo', route.params.cabinetId)
//   await store.dispatch('GET_cabinetItems', route.params.cabinetId)
//   state.changeCabTime = !state.changeCabTime
// }
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
