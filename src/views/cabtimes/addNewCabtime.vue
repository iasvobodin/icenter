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
      <span
        style="cursor: pointer"
        @click="clearstate"
      >&#10060;</span>
    </h3>
    <h3>Номер WO {{ projectInfoState['wo'] }}</h3>

    <cab-time-view
      :input-data="
        JSON.parse(
          JSON.stringify(
            state.cabTime ? state.cabTime : store.state.template.CabTimeV3
          )
        )
      "
      :change-data="true"
      :template-data="
        JSON.parse(JSON.stringify(store.state.template.CabTimeV3))
      "
      @final="em($event)"
    />
    <item-photo-uploader
      :change-photos-flag="true"
      container="cabtime-photo"
      :object-id="`cabtime__${projectInfoState.wo}`"
      :save-changes-photo="state.saveChanges"
      @updated-photos="updatePhotoCollection"
    />
  </section>
  <br />
  <button
    v-if="projectInfoState?.wo"
    :disabled="state.sandingCabTime"
    @click="postCabTime"
  >Сохранить</button>
  <br />
  <br />
</template>

<script setup>
import itemPhotoUploader from '@/components/itemPhotoUploader.vue'
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

router.beforeEach((to, from) => {
  console.log(from.fullPath)
  if (from.fullPath === '/cabtimes') {
    store.commit('SETcurrentProject', {})
  }
})
const state = reactive({
  sandingCabTime: false,
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
  cabTime: null,
  saveChanges: false,
  updatedPhotos: [],
})
const getCabTime = async (wo) => {
  const { request, response } = useFetch(`/api/getitembyid/cabtime__${wo}`)
  try {
    await request()
    state.cabTime = response
  } catch (error) {
    console.log('cant get cabTime request')
  }
  // state.errors = response
  // state.projects = JSON.parse(JSON.stringify(state.errors))
}
const projectInfoState = computed(() => store.state.projectInfo)

const updatePhotoCollection = (e) => {
  state.updatedPhotos = e
}

const fetchProjectList = async () => {
  if (!state.projectData) {
    state.fetchProject = await (await fetch(`/api/projects?status=open`)).json()
    state.projectData = state.fetchProject.map((el) => el.id)
  }
}
fetchProjectList()
const chooseCabinet = async (e) => {
  const wo = e.split('   ')[0]
  await getCabTime(wo)
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
  state.sandingCabTime = true
  const photos = state.updatedPhotos
  const { request } = useFetch('/api/post_item', {
    method: 'POST', // или 'PUT'
    body: JSON.stringify({
      ...state.ctv3,
      body: state.ctv3.body.filter((e) => e.value),
      photos,
      "history": [],
    }),
  })
  await request()
  await store.dispatch('UPLOAD_PHOTOS', 'cabtime-photo')
  router.back()
}

const clearstate = () => {
  store.commit('SETcurrentProject', {})
  state.projectInformation = null
}
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
