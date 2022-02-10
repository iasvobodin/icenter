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
  <div class="ddiv" data-tid="f22fdef8">
    <label class="llable">
      <input v-model="view" type="radio" class="iinput" value="table" name="viewType" checked />
      <span class="sspan" :class="{ activetable: view === 'table' }"></span>
    </label>
    <label class="llable">
      <input v-model="view" type="radio" class="iinput" value="grid" name="viewType" />
      <span class="sspan2" :class="{ activegrid: view === 'grid' }"></span>
    </label>
  </div>
  <br />
  <div v-if="state.errors && view === 'grid'">
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
              <p class="over">{{ value.info?.base?.['Project Name'] }}</p>
            </div>
            <hr style="margin: 0" />
            <div class="double">
              <div class="cabinet__info__item">
                <p>
                  <b>PM:</b>
                </p>
                <p class="over">{{ value.info?.base?.PM }}</p>
              </div>
              <div class="cabinet__info__item">
                <p>
                  <b>SF:</b>
                </p>
                <p
                  class="over"
                >{{ value.info?.extends?.['senior fitter']?.includes('@') ? value.info?.extends?.['senior fitter']?.split('@')[0].split('.')[1] : value.info?.extends?.['senior fitter']?.split('.')[0] }}</p>
              </div>
            </div>
            <hr style="margin: 0" />

            <div class="double">
              <div class="cabinet__info__item">
                <p>
                  <b>Отгрузка:</b>
                </p>
                <p class="over">{{ value.info?.extends?.['Shipping date'] }}</p>
              </div>
              <div class="cabinet__info__item">
                <p>
                  <b>QTY:</b>
                </p>
                <p class="over">{{ value.cabinets?.length }}</p>
              </div>
            </div>
            <hr style="margin: 0" />
            <div class="vertical">
              <p>
                <b>Comments:</b>
                {{ value.info?.extends?.['Comments field'] }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <br />
    </div>
    <router-link to="/projects/addnewprojectManual">
      <img class="add__button" src="/img/add.svg" alt="Добавить новый проект" />
    </router-link>
  </div>

  <section v-if="view === 'table'" class="table">
    <table>
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
      <tr class="head">
        <th>№</th>
        <th v-for="(vv, kk) in extendTemplate" :key="kk" @click="sortBy(kk, 'extends')">{{ kk }}</th>
      </tr>
      <tbody>
        <tr v-for="(value, key, index) in state.projects" :key="index" @click="getIndex(key)">
          <td
            style="cursor: pointer;"
            @click="
              !selectedStatus
                ? $router.push(`/projects/${value.id}`)
                : $router.push(`/projects/${value.id}?status=closed`)
            "
          >
            <h2 class="project__number">{{ value.id }}</h2>
          </td>
          <td v-for="(v, k) in extendTemplate" :key="k">
            <render-inputs
              v-if="state.changeTable"
              v-model="state.projects[key].info.extends"
              :data-render="v"
            />
            <p v-else>{{ state.projects[key].info.extends[k] }}</p>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
  <br />
  <br />
  <button
    v-if="
      state.errors && view === 'table' && !state.changeTable &&
      $store.state.user.info.userRoles.includes('godmode')
    "
    @click="state.changeTable = !state.changeTable"
  >Change ALL</button>
  <button v-if="state.changeTable && state.errors" @click="updateChangedProjects">Update</button>
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
// router.beforeEach(async (to, from) => {
//   !store.state.template && (await store.dispatch('extendProject'))
//   return true
// })

const selectedStatus = ref(false)
const view = ref('grid')


const state = reactive({
  changeAllFlag: false,
  errors: <projectType[]>{},
  actualStatus: <string[]>{},
  search: '',
  projects: <projectType[]>{},
  updateIndex: new Set() as Set<number>,
  changeTable: false
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
  ).sort(function (a, b) {
    const nameA = a.id.toLowerCase()
    const nameB = b.id.toLowerCase()
    if (nameA < nameB) {
      return -1
    }
    if (nameA > nameB) {
      return 1
    }
    return 0
  })



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
.cabinet__info__item {
  /* border-bottom: 1px solid rgb(102, 102, 102); */
  padding: 5px;
  /* width: 100%; */
  display: grid;
  align-items: center;
  grid-template-columns: 2fr 5fr;

  /* width: 200px; */
}
.over {
  overflow: hidden;
  /* padding: 2em; */
  text-overflow: ellipsis;
  white-space: nowrap;
}
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
  width: max(95vw, 1200px);
}
/* table {
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
} */
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
  align-items: center;
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
  /* place-self: center;
  white-space: pre-wrap;
  word-wrap: break-word; */
}
.vertical {
  grid-auto-flow: row;
  grid-template-columns: 1fr;
  row-gap: 5px;
  padding: 5px;
}
.vertical p {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-align: left;
  line-height: 1.3;
}

.ddiv {
  font-size: 0.8em;
  color: #2b2b2b;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  display: flex;
  line-height: 28px;
  justify-content: flex-end;
  width: 95%;
  margin: auto;
}
.llable {
  /* font: 0.8em YS Text, Arial, Helvetica, sans-serif; */
  color: #2b2b2b;
  -webkit-font-smoothing: antialiased;
  line-height: 28px;
  box-sizing: border-box;
  z-index: 2;
  display: inline-block;
  margin: 0 -1px 0 0;
  user-select: none;
  text-align: center;
  outline: 0;
  touch-action: manipulation;
  cursor: pointer;
  position: relative;
  background-position: 6px 1px;
  background-repeat: no-repeat;
}
.iinput {
  -webkit-font-smoothing: antialiased;
  user-select: none;
  box-sizing: border-box;
  /* font-family: Arial, Helvetica, sans-serif; */
  position: absolute;
  cursor: pointer;
  opacity: 0;
}
.sspan {
  /* font: 0.8em YS Text, Arial, Helvetica, sans-serif; */
  color: #2b2b2b;
  -webkit-font-smoothing: antialiased;
  line-height: 28px;
  user-select: none;
  text-align: center;
  cursor: pointer;
  box-sizing: border-box;
  position: relative;
  background-position: 6px 1px;
  background-repeat: no-repeat;
  z-index: 1;
  padding: 0 1em;
  pointer-events: none;
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMyIgaGVpZ2h0PSIxMyIgZmlsbD0iI2IyYjJiMiI+PHBhdGggZD0iTTAgMTBoM3YzSDB6bTUgMGg4djNINXpNMCA1aDN2M0gwem01IDBoOHYzSDV6TTAgMGgzdjNIMHptNSAwaDh2M0g1eiIvPjwvc3ZnPg==);
}
.sspan2 {
  /* font: 0.8em YS Text, Arial, Helvetica, sans-serif; */
  color: #2b2b2b;
  -webkit-font-smoothing: antialiased;
  line-height: 28px;
  user-select: none;
  text-align: center;
  cursor: pointer;
  box-sizing: border-box;
  position: relative;
  background-position: 6px 1px;
  background-repeat: no-repeat;
  z-index: 1;
  padding: 0 1em;
  pointer-events: none;
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMyIgaGVpZ2h0PSIxMyIgZmlsbD0iI2IyYjJiMiI+PHBhdGggZD0iTTAgMGg2djZIMHptNyAwaDZ2Nkg3em0wIDdoNnY2SDd6TTAgN2g2djZIMHoiLz48L3N2Zz4=);
}

.activegrid {
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMyIgaGVpZ2h0PSIxMyIgZmlsbD0iIzJiMmIyYiI+PHBhdGggZD0iTTAgMGg2djZIMHptNyAwaDZ2Nkg3em0wIDdoNnY2SDd6TTAgN2g2djZIMHoiLz48L3N2Zz4=);
}
.activetable {
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMyIgaGVpZ2h0PSIxMyIgZmlsbD0iIzJiMmIyYiI+PHBhdGggZD0iTTAgMTBoM3YzSDB6bTUgMGg4djNINXpNMCA1aDN2M0gwem01IDBoOHYzSDV6TTAgMGgzdjNIMHptNSAwaDh2M0g1eiIvPjwvc3ZnPg==);
}
tbody tr td {
  padding: 6px;
  /* padding-bottom: 6px; */
}
tbody tr td p {
  text-align: left;
}
</style>
