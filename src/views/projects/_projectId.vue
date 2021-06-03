<template>
      <h1>Номер проекта {{ $route.params.projectId }}</h1>
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
       <tr @click="$router.push(`/cabinets/${cab.wo}`)" v-for="(value, i) in project.cabinets" :key="i">
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
      <button v-if="changeData" @click="updateWO">Обновить WO</button>
      <br>
      <br>
    </section>
</template>

<script>
import chooseWoNumber from '@/components/chooseWoNumber.vue'
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
  },
  setup() {
    const route = useRoute()
    const state = reactive({
      project: null,
      newWO: null,
      changeData: false,
      updateWOFlag:false,
      resCabinets:{}
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
    return {
      updateWO,updateProject,
      ...toRefs(state),
    }
  },
}
</script>

<style lang="css" scoped>
section{
  border-right: 1px solid black;
  padding-right: 1vw;
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
</style>