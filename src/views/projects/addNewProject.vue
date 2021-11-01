<template>
  <div class="project__holder">
    <br />
    <button @click="$router.push('/projects/addnewprojectManual')">
      Добавить проект вручную
    </button>
    <div class="project">
      <br />
      <p v-if="projectList && projectList.lastUpdate">
        LegendStats latest update :
        {{ formatDate(new Date(projectList.lastUpdate * 1000)) }}
      </p>
      <br />
      <choose-project-number
        v-if="projectList"
        :data-to-render="projectList.data.map((e) => `${e['id']}`)"
        @choose-project-number="choose"
      />
      <div v-if="selectedProject">
        <h3>Информация по проекту</h3>
        <form class="project__info" @submit.prevent="postProject">
          <div v-if="!$store.state.template" class="fetchHolder">Load</div>
          <div v-for="(val, key, index) in selectedProject.info" :key="index">
            <div class="project__info__row">
              <span>{{ key }}:</span>
              <span>{{ val }}</span>
            </div>
          </div>
          <h3>Заполните поля</h3>
          <conditional-render
            v-model="selected.extend"
            :data-render="$store.state.template.template.extend"
          />
          <div class="cabinet__info">
            <h3>Выберете шкафные линии</h3>
            <choose-wo-number
              :multiple-permission="true"
              :cabinet-list="selectedProject.cabinets"
              @checked-wo="($event) => (selected.cabinets = $event)"
            />
          </div>
          <input class="add__button" type="submit" value="submit" />
        </form>
      </div>
    </div>
    <!-- <project-info v-if="validateData" :cabinets="checkedCabinetsNames" :projectNumber="woList[0].project" :project="{...woList[0]['project info'], ...selected} " /> -->
  </div>
</template>

<script setup>
import chooseProjectNumber from '@/components/chooseProjectNumber.vue'
import chooseWoNumber from '@/components/chooseWoNumber.vue'
import conditionalRender from '@/components/conditionalRender.vue'
import { useFetch } from '@/hooks/fetch'
import { useProjects } from '@/hooks/projectlsit'
import { useRouter } from 'vue-router'
import { ref, reactive } from '@vue/runtime-core'
// import projectInfo from './projectInfo.vue';
// export default {
//   components: {
//     chooseProjectNumber,
//     chooseWoNumber,
//     conditionalRender,
//   },
//   setup() {
const router = useRouter()
const projectList = ref(null)
const selectedProject = ref(null)
const fetchProjectList = async () => {
  projectList.value = (await useProjects()).projetList.value
}
fetchProjectList()

const selected = reactive({
  extend: {},
  cabinets: [],
})

function formatDate(date) {
  return `${date.getDate()}/0${date.getMonth() + 1}/${date.getFullYear()}`
}

const woList = ref(null)

async function choose(e) {
  selectedProject.value = projectList.value.data.find((p) => p['id'] === e)
}
const postProject = async () => {
  const { request, response } = useFetch('/api/POST_project', {
    method: 'POST', // или 'PUT'
    body: JSON.stringify({
      id: selectedProject.value.id.includes('.')
        ? selectedProject.value.id.replace('.', ',')
        : selectedProject.value.id,
      status: 'open',
      info: {
        base: selectedProject.value.info,
        extends: selected.extend,
      },
      cabinets: selected.cabinets,
    }),
  })
  await request()
  selected.extend = {}
  selected.cabinets = []
  router.push('/projects')
}

//   return {
//     postProject,
//     projectList,
//     choose,
//     woList,
//     formatDate,
//     selected,
//     selectedProject,
//   }
// },
// }
</script>

<style lang="css" scoped>
.add__button {
  margin: auto;
  width: 50%;
  height: 30px;
  margin-top: 15px;
  margin-bottom: 15px;
  background-color: rgb(255, 164, 59);
}
table {
  border-collapse: collapse;
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
  background: yellow;
}
.project__info__row {
  border-bottom: solid 1px black;
  /* background: rgba(214, 214, 214, 0.459); */
  padding: 5px;
  display: grid;
  grid-template-columns: 1fr 2fr;
}
.project__info__row > span {
  justify-self: stretch;
  align-self: center;
  /* place-self: start; */
  text-align: start;
}
.project__holder {
  width: min(1200px, 95vw);
  display: grid;
  margin: auto;
  grid-template-columns: 1fr;
  justify-content: space-around;
  column-gap: 5vw;
}
.project__info {
  display: grid;
}

.cabinet__info {
  margin-top: 3vh;
}
.project_input {
  width: 100%;
  height: 35px;
  text-align: center;
}
.loading {
  background: url(/img/loading.gif) no-repeat right center;
}
.project_list_holder {
  /* cursor: pointer; */
  max-height: 40vh;
  overflow-y: scroll;
}
.project_list {
  display: list-item;
  padding: 0;
  height: inherit;
}
.project_item {
  border-radius: 2px;
  padding: 2px;
  margin: 2px;
  list-style: none;
  border-bottom: 1px solid rgb(112, 112, 112);
}
.project_item:hover {
  background-color: rgba(55, 158, 255, 0.658);
}
.cabinet__info__item {
  border-bottom: 1px solid black;
  padding: 5px;
  /* width: 100%; */
  display: grid;
  grid-template-columns: 1fr 4fr;
}
.cabinet__info__item > h3 {
  justify-self: start;
  align-self: center;
  text-align: start;
}
.cabinet__info__item > p {
  justify-self: end;
  text-align: end;
  align-self: center;
}
</style>
