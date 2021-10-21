<template>
  <div>
    <h2>Добавление новой ошибки.</h2>
    <div v-if="!$store.state.projectInfo?.wo">
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
    </div>
    <div v-else>
      <h3>
        Номер проекта {{ projectInfoState['project number'] }}
        <span style="cursor: pointer" @click="clearstate">&#10060;</span>
      </h3>
      <h3>Номер WO {{ projectInfoState['wo'] }}</h3>
      <set-error />
    </div>
  </div>
</template>

<script setup>
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
})
// console.log(router, 'router');
router.afterEach((to, from) => {
  if (from.fullPath === '/errors') {
    store.commit('SETcurrentProject', null)
  }
})
// onUnmounted(()=> store.commit('SETcurrentProject', null))
const projectInfoState = computed(() => store.state.projectInfo)
const chooseCabinet = (e) => {
  state.cabinet = e.split('   ')[0]
  store.commit('SETcabinetInfo', e)
  state.woState = true
}
const choose = ($event) => {
  if (!$event) {
    state.projectInformation = false
    return
  }
  state.projectInformation = state.fetchProject.filter(
    (e) => e.id === $event
  )[0]
  store.commit('SETprojectInfo', state.projectInformation)
}
const fetchProjectList = async () => {
  if (!state.projectData) {
    const { request, response } = useFetch(`/api/projects?status=open`)
    await request()
    state.fetchProject = response
    state.projectData = state.fetchProject.map((el) => el.id)
  }
}
fetchProjectList()
const clearstate = () => {
  store.commit('SETcurrentProject', {})
  state.projectInformation = null
}
</script>

<style lang="css" scoped>
fieldset {
  width: 500px;
  margin: auto;
}
</style>
