<template>
  <h2>Расчёт нового CabTime</h2>
  <div v-if="!projectInfoState?.wo">
    <choose-project-number
      :data-to-render="state.projectData"
      @input-project-event="fetchProjectList"
      @choose-project-number="choose"
    />
    <div v-if="state.projectInformation">
      <br />
      <choose-project-number
        :data-to-render="
          state.projectInformation.cabinets.map(
            (e) => e.wo + '   ' + e['cab name']
          )
        "
        @choose-project-number="chooseCabinet"
      />
    </div>
  </div>
  <section v-else>
    <h3>
      Номер проекта {{ projectInfoState['project number'] }}
      <span style="cursor: pointer" @click="clearstate">&#10060;</span>
    </h3>
    <h3>Номер WO {{ projectInfoState['wo'] }}</h3>

    <cab-time-view
      :input-data="JSON.parse(JSON.stringify(store.state.template.CabTimeV3))"
      :change-data="true"
      :template-data="
        JSON.parse(JSON.stringify(store.state.template.CabTimeV3))
      "
      @final="em($event)"
    />
  </section>
  <br />
  <button v-if="projectInfoState?.wo" @click="postCabTime">SEND</button>
  <br />
  <br />
</template>

<script setup>
import { useFetch } from '@/hooks/fetch'
import CabTimeView from '@/components/CabTimeView.vue'
import conditionalRender from '@/components/conditionalRender.vue'
import chooseWoNumber from '@/components/chooseWoNumber.vue'
import chooseProjectNumber from '@/components/chooseProjectNumber.vue'
import { useStore } from 'vuex'
import { onBeforeRouteUpdate, useRouter } from 'vue-router'
import { reactive, toRefs, computed, nextTick, onMounted } from 'vue'

const store = useStore()
const router = useRouter()
router.afterEach((to, from) => {
  if (from.fullPath === '/cabtimes') {
    console.log(from, 'frooooom')
    store.commit('SETcurrentProject', null)
  }
})
const state = reactive({
  adminCoef: '12',
  documents: '240',
  type: null,
  cabtimeCopy: null,
  fetchProject: null,
  projectInformation: null,
  projectData: null,
  cabinet: '',
  cabtimetype: null,
  ctg: null,
  ctv3: null,
})

const projectInfoState = computed(() => store.state.projectInfo)

const fetchProjectList = async () => {
  if (!state.projectData) {
    state.fetchProject = await (await fetch(`/api/projects?status=open`)).json()
    state.projectData = state.fetchProject.map((el) => el.id)
  }
}
fetchProjectList()
const chooseCabinet = (e) => {
  store.commit('SETcabinetInfo', e)
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
const em = (e) => {
  state.ctv3 = e
}
const postCabTime = async () => {
  await photo()

  const { request } = useFetch('/api/post_item', {
    method: 'POST', // или 'PUT'
    body: JSON.stringify({
      ...state.ctv3,
    }),
  })
  await request()
  router.back()
}
const photo = async () => {
  const formData = new FormData()
  state.ctv3.blobFiles.map((e, i) => formData.set(`photo${i + 1}`, e, state.ctv3.photos[i]))
  // UPLOAD PHOTOS
  const {request, response} = useFetch('/api/blob?container=cabtime-photo&test=true', {
    method: 'POST',
    body: formData,
  })
  await request()
  state.ctv3.blobFiles = null
}

const clearstate = () => {
  store.commit('SETcurrentProject', {})
  state.projectInformation = null
  // state.ctv3 = JSON.parse(JSON.stringify(store.state.template.CabTimeV3))
}

//         return {
//             CabTimeGroup,
//             projectInfoState,
//             clearstate,
//             cabtimeResult,
//             addNewRow,
//             // getType,
//             groupBy,
//             postCabTime,
//             fetchProjectList,
//             // result,
//             calculateLogic,
//             choose, // filterByGroup,
//             cabtimeVal,
//             chooseCabinet,
//             finalResult,
//             // summByType,
//             ...toRefs(state)
//         }
//     }
// }
</script>

<style lang="css" scoped>
.administration {
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 1fr 1fr;
}
.add__row {
  border: 1px solid orange;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  margin-top: 5px;
  font-size: 30px;
  line-height: 1;
}
.add__row:hover {
  color: white;
  background-color: orange;
}
.cabtime__name {
  text-align: start;
}
.cabtime__input {
  width: min(100%, 60px);
}
table {
  margin: auto;
  margin-top: 2vh;
  border-collapse: collapse;
  border-radius: 5px;
  width: min(95vw, 800px);
}
td,
th {
  border: 1px solid #999;
  padding: 0.5rem;
  font-size: 12px;
}
tbody tr:nth-child(odd) {
  background: #eee;
}
tbody tr:hover {
  background: rgba(255, 166, 0, 0.1);
}
.textarea {
  display: grid;
  grid-template-columns: 1fr 24px;
  grid-auto-flow: column;
}
.close {
  cursor: pointer;
  place-self: center;
}
</style>
