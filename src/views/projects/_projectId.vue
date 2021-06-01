<template>
  <div v-if="project">
    <h1>{{ project.id }}</h1>
    <h3>Основная информация</h3>
    <info-render :info-data="project.info.base" />
    <h3>Дополнительные сведения</h3>
    <info-render v-if="!changeData" :info-data="project.info.extends" />
     <conditional-render v-else
     v-model="project.info.extends" 
     :data-render="$store.state.template.template.extend" 
     :required="!$store.state.user.info.userRoles.includes('admin')" />
    <h3>Шкафы</h3>
    <div
    v-for="(cab, i) in project.cabinets"
      v-if="!updateWOFlag"
      :key="i"
      class="holder"
      @click="$router.push(`/cabinets/${cab.wo}`)"
    >
      <info-render :info-data="cab" /> <br />
    </div>
    
    <choose-wo-number
    v-else
      :multiple-permission="true"
      :cabinet-list="newWO"
      @checked-wo="($event) => (project.cabinets = $event)"
    />
    <br>
    <button v-if="!changeData" @click="changeData = !changeData">Редактировать</button>
    <button v-else @click="updateProject">Сохранить</button>
    <button v-if="changeData" @click="updateWO">Обновить WO</button>
    <br>
    <br>
  </div>
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
.holder {
  border: 1px solid orange;
  margin: 1vh;
  border-radius: 4px;
  cursor: pointer;
}
.holder:last-child {
  border: 0px;
}
</style>