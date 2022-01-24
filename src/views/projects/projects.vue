<template>
  <h1>Проекты.</h1>
  <p>
    В данном разделе можно добавлять и редактировать информацию по текущим
    проектам ICenter.
  </p>
  <br />
  <input id="select__filter" v-model="state.search" type="text" placeholder="SF, PM, №" />
  <br />
  <button class="my__projects" @click="myProjects">Мои проекты</button>
  <br />
  <div class="holder__switch">
    <div class="open" :class="{ isactive: !selectedStatus }">
      <h3>Открытые</h3>
    </div>
    <div class="switch">
      <input id="switch-1" v-model="selectedStatus" type="checkbox" class="switch-input" />
      <label for="switch-1" class="switch-label">Switch</label>
    </div>
    <div class="close" :class="{ isactive: selectedStatus }">
      <h3>Закрытые</h3>
    </div>
  </div>

  <br />
  <div v-if="state.errors">
    <div
      v-for="status in state.actualStatus"
      v-show="groupProjects(status).length != 0"
      :key="status"
    >
      <div class="group__items">
        <h3>{{ status?.split('-')[1].split('/')[0] }}</h3>
      </div>
      <div class="errors__holder">
        <div
          v-for="(value, key, index) in groupProjects(status)"
          :key="index"
          class="error__card__holder"
          @click="
            !selectedStatus
              ? $router.push(`/projects/${value.id}`)
              : $router.push(`/projects/${value.id}?status=closed`)
          "
        >
          <div class="item__card" :class="{ closed__card: selectedStatus }">
            <div class="double">
              <h2>{{ value.id }}:</h2>
              <p>{{ value.info?.base?.['Project Name'] }}</p>
            </div>
            <hr style="margin: 0" />
            <!-- <info-render :info-data="{[value.id]: value.info.base['Project Name']}" /> -->
            <div class="double">
              <info-render :info-data="{ PM: value.info?.base?.PM }" />
              <info-render
                :info-data="{
                  SF: value.info?.extends?.['senior fitter']
                    ?.split('@')[0]
                    .split('.')[1],
                }"
              />
            </div>
            <div class="double">
              <info-render
                :info-data="{
                  Отгрузка: value.info?.extends?.['Shipping date'],
                }"
              />
              <info-render :info-data="{ QTY: value.cabinets?.length }" />
            </div>
            <info-render
              :hr="false"
              :info-data="{ Comments: value.info?.extends?.['Comments field'] }"
            />
          </div>
        </div>
      </div>
      <br />
    </div>
    <router-link to="/projects/addnewproject">
      <img class="add__button" src="/img/add.svg" alt="Добавить новый проект" />
    </router-link>
  </div>

  <section v-if="state.changeAllFlag" class="table">
    <table style="width: 100%">
      <colgroup>
        <col span="1" style="width: 6%" />
        <col span="1" style="width: 10%" />
        <col span="1" style="width: 10%" />
        <col span="1" style="width: auto" />
        <col span="1" style="width: auto" />
        <col span="1" style="width: 6%" />
        <col span="1" style="width: 6%" />
        <col span="1" style="width: 6%" />
      </colgroup>
      <tr style="border: solid 2px orange">
        <th>№</th>
        <th v-for="(vv, kk) in extendTemplate" :key="kk" @click="sortBy(kk, 'extends')">{{ kk }}</th>
      </tr>
      <tbody>
        <tr v-for="(value, key, index) in state.projects" :key="index" @click="getIndex(key)">
          <td>
            <h2 class="project__number">{{ value.id }}</h2>
          </td>
          <td v-for="(v, k) in extendTemplate" :key="k">
            <render-inputs
              v-model="state.projects[key].info.extends"
              :data-render="extendTemplate[k]"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </section>
  <br />
  <br />
  <button
    v-if="
      !state.changeAllFlag &&
      state.errors &&
      $store.state.user.info.userRoles.includes('admin')
    "
    @click="state.changeAllFlag = !state.changeAllFlag"
  >Change ALL</button>
  <button v-if="state.changeAllFlag && state.errors" @click="updateChangedProjects">Update</button>
  <br />
  <br />
</template>

<script setup lang="ts">
import { reactive, toRefs, watch, computed, ref } from 'vue'
import { useFetch } from '@/hooks/fetch'
import infoRender from '@/components/infoRender.vue'
import { useStore } from 'vuex'
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRouter } from 'vue-router'
import renderInputs from '@/components/renderInputs'
// import { projectType } from '@/projectType'


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
    } | null
  ],
}

const router = useRouter()
const store = useStore()

// store.dispatch('createProjectInfo')
router.beforeEach(async (to, from) => {
  !store.state.template && (await store.dispatch('extendProject'))
  return true
})

const selectedStatus = ref(false)


const state = reactive({
  changeAllFlag: false,
  errors: <projectType[]>{},
  actualStatus: <string[]>{},
  search: '',
  projects: <projectType[]>{},
  updateIndex: new Set() as Set<number>,
})

const getIndex = (i: number) => state.updateIndex.add(i)

const filterProjects = computed(() => {
  //  debugger
  return state.search
    ? state.errors.filter((e) =>
      [e?.id, e.info.base?.PM, e.info.extends?.['senior fitter']].some(
        (s) => s && s.toLowerCase().includes(state.search.toLowerCase())
      )
    )
    : state.errors
})
// store.dispatch('extendProject')
const extendTemplate = computed(() => store.state.template.template.extend)

watch(selectedStatus, (newValue, oldValue) => {
  if (newValue === true) {
    getErrors('closed')
  }
  if (newValue === false) {
    getErrors('open')
  }
})

const groupProjects = (status: string) =>
  filterProjects.value &&
  filterProjects.value.filter(
    (f) => f.info?.extends['status project'] === status
  )



const getErrors = async (status: 'open' | 'closed') => {
  const { request: reqProjects, response: resProjects } = useFetch<projectType[]>(`/api/projects?status=${status}`)
  await reqProjects()
  state.errors = resProjects.value!

  state.projects = JSON.parse(JSON.stringify(resProjects.value))

  state.actualStatus = [
    ...resProjects.value!.reduce(
      (acc, pr) => acc.add(pr.info?.extends['status project']),
      new Set() as Set<string>
    ),
  ].sort()

  state.errors.sort(function (a, b) {
    const nameA = a.info?.extends['status project']?.toLowerCase()
    const nameB = b.info?.extends['status project']?.toLowerCase()
    if (nameA < nameB) {
      return -1
    }
    if (nameA > nameB) {
      return 1
    }
    return 0
  })
}
getErrors('open')


// console.log(Array.from({ length: 20 }).map(()=> ));
const postProject = async (index: number) => {
  const { request: postProject } = useFetch('/api/POST_project', {
    method: 'POST', // или 'PUT'
    body: JSON.stringify({
      ...state.projects[index],
    }),
  })
  await postProject()
}
const updateChangedProjects = async () => {
  await Promise.all(
    [...state.updateIndex].map(async (e) => {
      await postProject(e)
    })
  )
  state.changeAllFlag = !state.changeAllFlag
  selectedStatus.value === true ? getErrors('closed') : getErrors('open')
}


const sortBy = (el: keyof projectType['info']['extends'], p: 'extends') => {

  state.projects.sort(function (a, b) {
    const nameA = a.info[p][el]?.toString().toLowerCase()
    const nameB = b.info[p][el]?.toString().toLowerCase()
    if (nameA < nameB) {
      return -1
    }
    if (nameA > nameB) {
      return 1
    }
    return 0
  })
}

const myProjects = () => {
  if (state.search !== store.state.user.info.userDetails.toLowerCase()) {
    state.search = store.state.user.info.userDetails.toLowerCase()
  } else {
    state.search = ''
  }
}
    // return {
    //   myProjects,
    //   extendTemplate,
    //   updateChangedProjects,
    //   getIndex,
    //   sortBy,
    //   groupProjects,
    //   selectedStatus,
    //   filterProjects,
    //   ...toRefs(state),
    // }
  // },
// }
</script>

<style lang="css" scoped>
.my__projects {
  position: absolute;
  right: 1vw;
  top: calc(50px + 1vw);
  width: fit-content;
}
.isactive {
  border-bottom: 1px solid orange;
  /* border-radius: 5px; */
}
.holder__switch {
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: auto;
  justify-content: center;
}

.close,
.open {
  width: 100px;
  display: inline-block;
}
h3 {
  margin: 0;
}
.switch {
  margin: 0 1vw;
  position: relative;
  display: inline-block;
}
.switch-input {
  display: none;
}
.switch-label {
  display: block;
  width: 48px;
  height: 24px;
  text-indent: -150%;
  clip: rect(0 0 0 0);
  color: transparent;
  user-select: none;
}
.switch-label::before,
.switch-label::after {
  content: "";
  display: block;
  position: absolute;
  cursor: pointer;
}
.switch-label::before {
  width: 100%;
  height: 100%;
  background-color: #dedede;
  border-radius: 9999em;
  -webkit-transition: background-color 0.25s ease;
  transition: background-color 0.25s ease;
}
.switch-label::after {
  top: 0;
  left: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid orange;
  background-color: #fff;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.45);
  -webkit-transition: left 0.25s ease;
  transition: left 0.25s ease;
}
.switch-input:checked + .switch-label::before {
  background-color: #dedede;
}
.switch-input:checked + .switch-label::after {
  left: 24px;
}
.project__number {
  white-space: pre-wrap;
  word-wrap: break-word;
}
.add__button::after {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: orange;
  filter: blur (20px);
  z-index: 2;
}
.add__button {
  position: fixed;
  z-index: 2;
  bottom: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  cursor: pointer;
}

.selectStatus > h3 {
  display: inline;
}

.change__status {
  width: auto;
}

.update__button {
  margin-top: 1vh;
}

.errors__holder {
  display: grid;
  align-items: stretch;
  width: 95%;
  margin: auto;
  grid-template-columns: repeat(auto-fill, minmax(max(20vw, 250px), 1fr));
  column-gap: 3vh;
  row-gap: 3vh;
}

.closed__card {
  border: 1px solid red;
  border-radius: 4px;
  padding: 5px;
  cursor: auto;
  min-height: 150px;
  height: 100%;
  overflow: hidden;
}

.error__card__holder {
  place-self: stretch;
  height: 100%;
}

/* .item__card:hover {
  border: 1px solid black;
  background: rgba(245, 254, 255, 0.356);
} */

.error__item {
  border-bottom: 1px solid black;
  padding: 2px;
  display: grid;
  grid-template-columns: 2fr 3fr;
}

.error__item__title {
  justify-self: start;
  align-self: center;
  text-align: start;
  margin: 0;
}

.error__item__desc {
  height: inherit;
  display: block;
  justify-self: end;
  text-align: end;
  align-self: center;
  margin: 0;
  border-bottom: none;
}

.loading {
  margin: auto;
  width: 30px;
  height: 30px;
  background: url(/img/loading.gif) no-repeat center bottom;
}

.error__desc {
  border-bottom: none;
  padding: 2px;
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr;
  border-bottom: none;
}

.error__item__vertical__title {
  width: inherit;
  text-align: center;
  margin: 5px;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.project__name {
  white-space: pre-wrap;
  word-wrap: break-word;
}

table {
  margin-top: 2vh;
  border-collapse: collapse;
  border-radius: 5px;
}
td,
th {
  border: 1px solid #999;
  padding: 5px;
  font-size: 12px;
}
tbody tr:nth-child(odd) {
  background: #eee;
}
tbody tr {
  height: 80px;
}

tbody tr:hover {
  background: rgba(0, 132, 255, 0.07);
}
th {
  position: sticky;
  top: 50px;
  color: white;
  background-color: rgb(0, 68, 129);
  border: solid 2px orange;
  box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4);
}
tr > th {
  cursor: pointer;
}
input[type="number"],
input[type="text"] {
  width: 100%;
  text-align: center;
}
textarea {
  height: 90px;
}
#select__filter {
  height: 30px;
  border: 1px solid orange;
  border-radius: 5px;
  line-height: 30px;
  font-size: 18px;
  text-align: center;
  width: min(400px, 95vw);
  margin: auto;
  padding: 0px;
}
:global(.group__items) {
  position: sticky;
  top: 50px;
  width: 100%;
  min-height: 50px;
  /* z-index: 2; */
  background-color: #ffffff;
  /* color: black; */
  margin: 1.5vh auto;
  margin-bottom: 40px;
  /* display: block; */
  box-shadow: rgba(0, 0, 0, 0.2) 0px 25px 20px -20px;
  /* border-radius: 5px; */
  /* width: min(700px, 95%); */
  /* padding: 0.01vh; */
  /* font-size: min(20px 5vw ); */
  /* transform: translateY(-50%); */
}
.group__items h3 {
  line-height: 50px;
}
.props {
  margin-top: 5px;
  border-bottom: 1px solid black;
}
.props:last-child {
  border-bottom: 1px solid white;
  text-align: left;
}
.double {
  display: grid;
  grid-auto-flow: column;
  column-gap: 1vw;
  grid-template-columns: 5fr 4fr;
  justify-content: space-between;
}
.double:first-child {
  display: grid;
  grid-auto-flow: column;
  column-gap: 1vw;
  grid-template-columns: 1fr 4fr;
  justify-content: space-between;
  margin-bottom: 1vh;
}
.double:first-child > p {
  place-self: center;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
