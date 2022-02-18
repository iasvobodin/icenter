<template>
  <div>
    <h2>Добавление новой ошибки.</h2>

    <teleport to="body">
      <confirm-popup :opened="!!!projectInfoState" @closed="popupClosed" @confirm="popupConfirmed">
        <template #header>
          <h3>Выберите шкаф.</h3>
        </template>
        <template #select>
          <selectWO @selected-wo="emitAlteredWo" />
          <!-- <p class="message">{{ state.message }}</p> -->
        </template>
        <template #buttons>
          <br />
        </template>
      </confirm-popup>
    </teleport>
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
  state.popupOpened = false
  // state.message = 'По выбранному WO должен быть расчитан CabTime'
}
async function popupConfirmed() {
  console.log();

}
router.afterEach((to, from) => {
  if (from.fullPath === '/errors') {
    store.commit('SETcurrentProject', '')
  }
})
const projectInfoState = computed(() => store.state.cabinetInfo)

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
