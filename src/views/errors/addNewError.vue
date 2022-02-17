<template>
  <div>
    <h2>Добавление новой ошибки.</h2>

    <teleport to="body">
      <confirm-popup
        v-if="!projectInfoState"
        :opened="state.popupOpened"
        @closed="popupClosed"
        @confirm="popupConfirmed"
      >
        <template #header>
          <h3>Выберите шкаф.</h3>
        </template>
        <template #select>
          <selectWO @selected-wo="emitAlteredWo" />
          <!-- <p class="message">{{ state.message }}</p> -->
        </template>
        <!-- <template #buttons>
          <button disabled class="popup__cancel__button" @click="createTask">Запустить задачу</button>
          <button class="popup__confirm__button" @click="popupClosed">Отмена</button>
        </template>-->
      </confirm-popup>
    </teleport>

    <!-- <div v-if="!$store.state.cabinetInfo">
      <choose-project-number
        v-if="!$store.state.projectInfo?.pm"
        :data-to-render="state.projectData"
        @input-project-event="fetchProjectList"
        @choose-project-number="choose"
      />
      <div v-if="state.projectInformation">
        <choose-project-number
          place-holder="Введите номер WO"
          :data-to-render="
            state.projectInformation.cabinets.map(
              (e) => e.wo + '   ' + e['cab name']
            )
          "
          @choose-project-number="chooseCabinet"
        />
      </div>
    </div>-->
    <div v-if="projectInfoState">
      <h3>
        Номер проекта {{ projectInfoState.info['project number'] }}
        <span
          style="cursor: pointer"
          @click="clearstate"
        >&#10060;</span>
      </h3>
      <h3>Номер WO {{ projectInfoState.info['wo'] }}</h3>
      <set-error />
    </div>
  </div>
</template>

<script setup lang="ts">
import selectWO from '@/components/selectWO.vue'
import confirmPopup from '@/components/modal/cunfirmPopup.vue'
import { useStore } from 'vuex'
import { computed, reactive, ref, onUnmounted } from 'vue'
import { useFetch } from '@/hooks/fetch'
import { useRouter } from 'vue-router'
import setError from '@/components/setError.vue'
import chooseProjectNumber from '@/components/chooseProjectNumber.vue'

const router = useRouter()
const store = useStore()
const state = reactive({
  projectData: null,
  fetchProject: null,
  projectInformation: null,
  woState: false,
  cabinet: '',
  popupOpened: false,
})

const emitAlteredWo = (e: string) => store.commit('SETcurrentProject', e)
function popupClosed() {
  state.popupOpened = !state.popupOpened
  // state.message = 'По выбранному WO должен быть расчитан CabTime'
}
async function popupConfirmed() {
  console.log();

}
// console.log(router, 'router');
router.afterEach((to, from) => {
  if (from.fullPath === '/errors') {
    store.commit('SETcurrentProject', '')
  }
})
// onUnmounted(()=> store.commit('SETcurrentProject', null))
const projectInfoState = computed(() => store.state.cabinetInfo)
// const chooseCabinet = (e) => {
//   state.cabinet = e.split('   ')[0]
//   store.commit('SETcabinetInfo', e)
//   state.woState = true
// }
// const choose = ($event) => {
//   if (!$event) {
//     state.projectInformation = false
//     return
//   }
//   state.projectInformation = state.fetchProject.filter(
//     (e) => e.id === $event
//   )[0]
//   store.commit('SETprojectInfo', state.projectInformation)
// }
// const fetchProjectList = async () => {
//   if (!state.projectData) {
//     const { request, response } = useFetch(`/api/projects?status=open`)
//     await request()
//     state.fetchProject = response
//     state.projectData = state.fetchProject.map((el) => el.id)
//   }
// }
// fetchProjectList()
const clearstate = () => {
  store.commit('SETcurrentProject', '')
  state.popupOpened = !state.popupOpened
  // state.projectInformation = null
}
</script>

<style lang="css" scoped>
fieldset {
  width: 500px;
  margin: auto;
}
</style>
