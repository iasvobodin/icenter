<template>
  <div v-if="project">
    <h1>{{ project.id }}</h1>
    <h3>Основная информация</h3>
    <info-render :info-data="project.info.base" />
    <h3>Дополнительные сведения</h3>
    <info-render :info-data="project.info.extends" />
    <h3>Шкафы</h3>
    <div
      v-for="(cab, i) in project.cabinets"
      :key="i"
      class="holder"
      @click="$router.push(`/cabinets/${cab.wo}`)"
    >
      <info-render :info-data="cab" /> <br />
    </div>
    <button @click="updateWO">Обновить WO</button>
    <choose-wo-number
      v-if="newWO"
      :multiple-permission="true"
      :cabinet-list="newWO"
      @checked-wo="($event) => (selected.cabinets = $event)"
    />
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
    // conditionalRender,
    infoRender,
    chooseWoNumber,
  },
  setup() {
    const route = useRoute()
    const state = reactive({
      project: null,
      newWO: null,
    })
    const getProject = async () => {
      const { request, response } = useFetch(
        `/api/projects?status=open&project=${route.params.projectId}`,
      )
      await request()
      state.project = response
    }
    const updateWO = async () => {
      const { request, response } = useFetch(
        `/api/cabinetList?updateWO=true&project=${route.params.projectId}`,
      )
      await request()
      state.newWO = response
    }
    getProject()

    return {
      updateWO,
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