<template>
      <h1 class="project__header">Номер проекта {{ $route.params.projectId }}</h1>
  <main v-if="project" class="project">
    <section class="project__info">
      <h3>Основная информация</h3>
      <info-render :info-data="project.info.base" />
    </section>
    <section class="project__extends">
      <h3>Дополнительные сведения</h3>
      <info-render v-if="!changeData" :info-data="project.info.extends" />
      <conditional-render v-else v-model="project.info.extends" :data-render="$store.state.template.template.extend"
        :required="!$store.state.user.info.userRoles.includes('admin')" />
    </section>
    <section class="project__cabinets">
      <h3>Шкафы</h3>
        <table v-if="!updateWOFlag" >
    <tr style="border: solid 2px orange">
      <th>WO</th>
      <th>Наименование</th>
    </tr>
    <tbody>
       <tr v-for="(value, i) in project.cabinets" :key="i" @click="$router.push(`/cabinets/${value.wo}`)">
      <td>{{ value.wo }}</td>
      <td class="tg-0lax">{{ value['cab name'] }}</td>
    </tr>
    </tbody>
  </table>
      <!-- <div v-if="!updateWOFlag" class="project__cabinets__info">
        <div v-for="(cab, i) in project.cabinets" :key="i" class="holder" @click="$router.push(`/cabinets/${cab.wo}`)">
          <p>{{cab['cab name']}} {{cab.wo}}</p>
          
        </div>
      </div> -->
      <choose-wo-number v-if="updateWOFlag" :multiple-permission="false" :cabinet-list="newWO"
        @checked-wo="($event) => (project.cabinets = $event)" />
    </section>
  </main>
    <section class="project__controls">
      <br>
      <button v-if="!changeData" @click="changeData = !changeData">Редактировать</button>
      <button v-else @click="updateProject">Сохранить</button>
      <button v-if="project?.info.extends['status project'] === '10-Отгружено Заказчику/Shipped to Customer' " @click="closeProject">Перевести в закрытые</button>
      <button v-if="changeData" @click="updateWO">Обновить WO</button>
      <button @click="generatedQR = true">Сгенерировать QR</button>
      <br>
      <br>
    </section>
    <section v-if="generatedQR" class="qrs">
      
    <generate-qr-code v-for="(value, i) in project.cabinets" :key="i" :generate-data="value"/>
    </section>
</template>

<script>
import chooseWoNumber from '@/components/chooseWoNumber.vue'
import generateQrCode from '@/components/generateQrCode.vue'
import { reactive, toRefs } from 'vue'
import { useFetch } from '@/hooks/fetch'
import { useRouter, useRoute } from 'vue-router'
import conditionalRender from '@/components/conditionalRender.vue'
import infoRender from '@/components/infoRender.vue'
export default {
  components: {
    conditionalRender,
    infoRender,
    chooseWoNumber,
    generateQrCode
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      project: null,
      newWO: null,
      changeData: false,
      updateWOFlag:false,
      resCabinets:{},
      generatedQR: false
    })
    const getProject = async () => {
      const { request, response } = useFetch(
        `/api/projects?status=open&project=${route.params.projectId}`,
      )
      if (!state.project) {
        
      await request()
      state.project = response
      state.resCabinets = response.value.cabinets
      }

      // state.selected = state.project
    }
    const updateWO = async () => {
      const { request, response } = useFetch(
        `/api/cabinetList?updateWO=true&project=${route.params.projectId.includes(',')?route.params.projectId.replace(',','.'): route.params.projectId}`,
      )
      if (!state.newWO) {
        await request() 
        state.newWO = response
      }
      state.updateWOFlag = !state.updateWOFlag
    }
    getProject()

const updateProject = async () => {
  const updateOptions = {
        method: 'POST', // или 'PUT'
        body: JSON.stringify({
          ...state.project, 
          id: state.project.id.includes('.')?state.project.id.replace('.',','): state.project.id
        }),
      }
        const { request, response } = useFetch(
        `/api/projects?updateProject=true`, updateOptions
      )
      await request()
      state.changeData = !state.changeData
      state.updateWOFlag = false
}
const closeProject = async () => {
  const updateOptions = {
    method: 'POST', // или 'PUT'
    body: JSON.stringify({
      ...state.project,
      id: state.project.id.includes('.') ? state.project.id.replace('.', ',') : state.project.id,
      status: 'closed'
    }),
  }
  const deleteOptions = {
    method: 'POST', // или 'PUT'
    body: JSON.stringify({
      id: state.project.id.includes('.') ? state.project.id.replace('.', ',') : state.project.id,
      status: 'open',
      ttl: 1
    }),
  }
  const {
    request: updateProject
  } = useFetch(
    `/api/projects?updateProject=true`, updateOptions
  )
  const {
    request: deleteProject
  } = useFetch(
    `/api/projects?updateProject=true`, deleteOptions
  )

  await deleteProject()
  await updateProject()

  router.push('/projects/')
  // state.changeData = !state.changeData
  // state.updateWOFlag = false
}
    return {
      updateWO,updateProject,closeProject,
      ...toRefs(state),
    }
  },
}
</script>

<style lang="css" scoped>

/* section{
  border-right: 1px solid black;
  padding-right: 1vw;
} */
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

.project{
  /* position: relative; */
  display: grid;
  width: 95%;
  margin: auto;
  grid-template-columns: repeat(auto-fit, minmax(max(30%, 300px), 1fr));
  column-gap: 1vw;
  justify-content: center;
}
.project:last-child{
  border-right: 1px solid white;
  background-color: lime;
}
.project__controls{
  /* position: absolute; */
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

@media print {
  .page{
  width:29.7cm ;
  margin: 0;
  height:21cm ;
  padding: 1cm;
  }
  @page {
    /* margin: 1cm; */
    size: A4 landscape;
}
   .project,
   .project__header,
   .project__controls,
   .user,
   .app__header{
     display: none;
     opacity: 0;
   }
   /* .qrs{
     height: 100vh;
   } */
}
</style>