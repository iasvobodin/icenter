<template>
  <div v-if="!state.generatedQR" class="wrapper">
    <h1 class="project__header">Номер проекта {{ $route.params.projectId }}</h1>
    <main v-if="Object.keys(state.project).length !== 0" class="project">
      <section class="project__info">
        <h3>Основная информация</h3>
        <info-render :info-data="state.project.info.base" />
        <!-- </section>
        <section class="project__extends">-->
        <h3>Дополнительные сведения</h3>
        <info-render v-if="!state.changeData" :info-data="state.project.info.extends" />
        <conditional-render
          v-else
          v-model="state.project.info.extends"
          :data-render="$store.state.template.template.extend"
          :required="!$store.state.user.info.userRoles.includes('admin')"
        />
      </section>
      <section class="project__cabinets">
        <h3>Шкафы</h3>
        <table v-if="!state.updateWOFlag">
          <tr style="border: solid 2px orange">
            <th>WO</th>
            <th>Наименование</th>
          </tr>
          <tbody>
            <tr
              v-for="(value, i) in state.project.cabinets"
              :key="i"
              @click="$router.push(`/cabinets/${value!.wo}`)"
            >
              <td>{{ value!.wo }}</td>
              <td class="tg-0lax">{{ value!['cab name'] }}</td>
            </tr>
          </tbody>
        </table>
        <!-- <div v-if="!updateWOFlag" class="project__cabinets__info">
        <div v-for="(cab, i) in project.cabinets" :key="i" class="holder" @click="$router.push(`/cabinets/${cab.wo}`)">
          <p>{{cab['cab name']}} {{cab.wo}}</p>
          
        </div>
        </div>-->
        <choose-wo-number
          v-if="state.updateWOFlag"
          :multiple-permission="false"
          :cabinet-list="state.newWO.cabinets"
          @checked-wo="state.project.cabinets = $event"
        />
      </section>
    </main>
    <section
      v-if="$route.query.status !== 'closed' && $store.state.user.info.userRoles.includes('godmode')"
      class="project__controls"
    >
      <br />
      <button
        v-if="!state.changeData && $store.state.user.info.userRoles.includes('admin')"
        @click="$router.push(`/projects/addnewprojectManual?projectID=${$route.params.projectId}`)"
      >Редактировать</button>
      <button v-else @click="updateProject">Сохранить</button>
      <button
        v-if="
          state.project?.info?.extends['status project'] ===
          '10-Отгружено Заказчику/Shipped to Customer'
        "
        @click="closeProject"
      >Перевести в закрытые</button>
      <button v-if="state.changeData" @click="updateWO">Обновить данные</button>
      <button
        v-if="$store.state.user.info.userRoles.includes('admin')"
        class="print__button"
        @click="printQR"
      >Распечатать QR</button>
      <br />
      <br />
    </section>

    <h2 v-else>
      <br />
      <br />Нельзя просто взять, и изменить проект.
    </h2>
  </div>

  <section class="qrs">
    <generate-qr-code v-for="(value, i) in state.project.cabinets" :key="i" :generate-data="value" />
  </section>
</template>

<script setup lang="ts">
import chooseWoNumber from '@/components/chooseWoNumber.vue'
import generateQrCode from '@/components/generateQrCode.vue'
import { nextTick, onBeforeUnmount, onMounted, reactive, toRefs } from 'vue'
import { useFetch } from '@/hooks/fetch'
import { useRouter, useRoute } from 'vue-router'
import conditionalRender from '@/components/conditionalRender.vue'
import infoRender from '@/components/infoRender.vue'
import { useStore } from 'vuex'


type projectType = {
  "id": string,
  "status": "open" | 'closed',
  "info": {
    "base": {
      "Project Name": string,
      "SZ №": number,
      "PM": string,
      "Buyer": string,
      "Contract Administrator": string,
      "Buyout Administrator": string,
      "Lead Engineer"?: string
    },
    "extends": {
      "Specific requirement field": string,
      "senior fitter": string,
      "status project": string,
      "Hours calculated": string,
      "Hours actual": string,
      "Comments field": string,
      "Shipping date": string
    }
  },
  "cabinets": [
    {
      "wo": string,
      "cab name": string
    }
  ],
}

type updatedWo = {
  Cabinets: string
  Project: string
  cabinets: projectType['cabinets'][]
  id: string
  info: {
    Buyer: string
    'Buyout Administrator': string
    'Contract Administrator': string
    'Lead Engineer': string
    PM: string
    'Project Name': string
    'SZ №': number
  }
}

// export default {
//   components: {
//     conditionalRender,
//     infoRender,
//     chooseWoNumber,
//     generateQrCode,
//   },
//   setup() {
const route = useRoute()
const router = useRouter()
const store = useStore()
const state = reactive({
  project: <projectType>{},
  newWO: <updatedWo>{},
  changeData: false,
  updateWOFlag: false,
  resCabinets: {},
  generatedQR: false,
})

const printQR = async () => {
  // state.generatedQR = !state.generatedQR
  await nextTick()
  window.print()
}
// onMounted(() => {

// })

const hendleKeyDown = (e: KeyboardEvent) => {
  console.log('key');

  e.key === 'Escape' && (state.generatedQR = false)
}


onMounted(() => {
  document.addEventListener('keydown', hendleKeyDown)
  document.addEventListener('afterprint', (event) => {
    console.log('After print');
    state.generatedQR = !state.generatedQR
  });
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', hendleKeyDown)
})

const getProject = async () => {
  const { request, response } = useFetch<projectType>(
    `/api/projects?status=${route.query.status ? 'closed' : 'open'
    }&project=${route.params.projectId}`
  )
  if (Object.keys(state.project).length === 0) {
    await request()
    state.project = response.value!
    state.resCabinets = state.project.cabinets


  }

  // state.selected = state.project
}
const updateCabinetInfo = async (payload: projectType) => {

  payload.cabinets.forEach((c) => {
    if (c) {
      const { request, response } = useFetch('/api/post_item', {
        method: 'POST',
        body: JSON.stringify({
          id: `info__${c.wo}`,
          type: 'info',
          info: {
            wo: c.wo,
            'cab name': c['cab name'],
            'project number': payload.id,
            "Project Name": payload.info.base['Project Name'],
            status: payload.status
          }
        }),
      })
      if (c.wo) {
        console.log('updateWOINFO');
        request()
      }
    }
  })
}

const updateWO = async () => {
  const { request, response } = useFetch<updatedWo>(
    `/api/cabinetList?updateWO=true&project=${typeof route.params.projectId === 'string' && route.params.projectId.includes(',')
      ? route.params.projectId.replace(',', '.')
      : route.params.projectId
    }`
  )
  if (Object.keys(state.newWO).length === 0) {
    await request()
    // const {cabinets} = JSON.parse(response)
    state.newWO = response.value!
    state.project.info.base = response.value!.info
  }
  state.updateWOFlag = !state.updateWOFlag
}

getProject()


const updateProject = async () => {
  const updateOptions = {
    method: 'POST', // или 'PUT'
    body: JSON.stringify({
      ...state.project,
      id: state.project.id.includes('.')
        ? state.project.id.replace('.', ',')
        : state.project.id,
    }),
  }
  const { request, response } = useFetch(
    `/api/projects?updateProject=true`,
    updateOptions
  )
  await request()
  await updateCabinetInfo(state.project)
  state.changeData = !state.changeData
  state.updateWOFlag = false
}

const closeProject = async () => {
  const updateOptions = {
    method: 'POST', // или 'PUT'
    body: JSON.stringify({
      ...state.project,
      id: state.project.id.includes('.')
        ? state.project.id.replace('.', ',')
        : state.project.id,
      status: 'closed',
    }),
  }
  const deleteOptions = {
    method: 'POST', // или 'PUT'
    body: JSON.stringify({
      id: state.project.id.includes('.')
        ? state.project.id.replace('.', ',')
        : state.project.id,
      status: 'open',
      ttl: 5,
    }),
  }
  const { request: updateProject } = useFetch(
    `/api/projects?updateProject=true`,
    updateOptions
  )
  const { request: deleteProject } = useFetch(
    `/api/projects?updateProject=true`,
    deleteOptions
  )

  await deleteProject()
  // setTimeout(async () => {
  await updateProject()

  await updateCabinetInfo({ ...state.project, status: 'closed' })// store.dispatch('createProjectInfo', )
  // console.log('UPDATE PROJECT')
  // }, 1)

  router.push('/projects/')

}

</script>

<style lang="css" scoped>
/* section{
  border-right: 1px solid black;
  padding-right: 1vw;
} */
.wrapper {
  position: relative;
  min-height: inherit;
}
table {
  margin-top: 2vh;
  border-collapse: collapse;
  border-radius: 5px;
  width: 100%;
  margin: auto;
}
td,
th {
  height: 15px;
  border: 1px solid #999;
  padding: 4px;
  font-size: 12px;
  cursor: pointer;
}
tbody tr:nth-child(odd) {
  background: #eee;
}
tbody tr:hover {
  background: rgba(255, 166, 0, 0.185);
}

.project {
  /* position: relative; */
  display: grid;
  width: 95%;
  margin: auto;
  grid-template-columns: repeat(auto-fit, minmax(min(95vw, 600px), 1fr));
  column-gap: 1vw;
  justify-content: center;
  justify-items: center;
}
.project__cabinets,
.project__info {
  width: min(95vw, 600px);
}
.project:last-child {
  border-right: 1px solid white;
  /* background-color: lime; */
}
.project__controls {
  /* position: absolute; */
  width: 100%;
  bottom: 0;
}
.holder {
  border: 1px solid orange;
  margin: 1vh;
  border-radius: 4px;
  cursor: pointer;
}
/* .holder:last-child {
  border: 0px;
} */
</style>
<style>
.qrs {
  display: none;
  /* padding-bottom: 20vh; */
}
@media print {
  html,
  body {
    border: 1px solid white;
    height: 99%;
    page-break-after: avoid;
    page-break-before: avoid;
  }

  .qrs {
    display: block;
    position: absolute;
    top: 0;
    overflow: hidden;
  }
  #view {
    padding: 0;
  }
  .page {
    width: 29.7cm;
    margin: 0;
    height: 21cm;
    display: grid;
    align-content: center;
    page-break-after: avoid;
    /* padding: 1cm; */
  }
  /* .page:last-child {
    page-break-after: auto;
  } */

  @page {
    /* margin: 1cm; */
    size: A4 landscape;
    overflow: hidden;
  }
  .project,
  .print__button,
  .project__header,
  .project__controls,
  .user,
  .app__header {
    display: none;
    opacity: 0;
  }
}
</style>