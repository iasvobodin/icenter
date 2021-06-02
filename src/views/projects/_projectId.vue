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
      <div v-if="!updateWOFlag" class="project__cabinets__info">
        <div v-for="(cab, i) in project.cabinets" :key="i" class="holder" @click="$router.push(`/cabinets/${cab.wo}`)">
          <info-render :info-data="cab" /> <br />
        </div>
      </div>
      <choose-wo-number v-if="updateWOFlag" :multiple-permission="true" :cabinet-list="newWO"
        @checked-wo="($event) => (project.cabinets = $event)" />
    </section>
  </main>
    <section class="project__controls">
      <button v-if="!changeData" @click="changeData = !changeData">Редактировать</button>
      <button v-else @click="updateProject">Сохранить</button>
      <button v-if="changeData" @click="updateWO">Обновить WO</button>
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
.project{
  /* position: relative; */
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(max(30vw, 300px), 1fr));
  column-gap: 3vw;
  justify-content: center;
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