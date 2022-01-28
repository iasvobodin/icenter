<template>
  <form class="project__info project__holder" @submit.prevent="postProject">
    <h1>Adding a project manually</h1>
    <br />
    <div v-for="(v, k, i) in state.extend" :key="i" class="error__item">
      <h4 style="text-align: start;">{{ k }}</h4>
      <div v-if="!state.changeData" class="editable">
        <div v-if="v._field === 'search'">
          <input
            required
            style="width: 100%;"
            :value="state.modelObject[k]"
            type="text"
            @input="searchPeople(k, $event)"
          />
          <div class="searchRes">
            <p
              v-for="(user, index) in state.extend[k].search"
              :key="index"
              class="search__result"
              @click="choosePeople(k, `${user.surname} ${user.givenName}`)"
            >{{ user.surname }} {{ user.givenName }}</p>
          </div>
        </div>
        <render-inputs
          v-else
          v-model.lazy="state.modelObject"
          style="width: 100%;"
          :required="true"
          :data-render="v"
        />
      </div>
      <div v-else class="value">
        <p style="text-align: start;">{{ state.modelObject[k] }}</p>
      </div>
    </div>
    <div class="cabinets">
      <br />
      <br />
      <h3>Шкафы</h3>
      <table>
        <colgroup>
          <col span="1" class="collgroup1" />
          <col span="1" class="collgroup2" />
          <col v-if="!state.changeData" span="1" class="collgroup3" />
        </colgroup>
        <tbody>
          <tr class="head">
            <th>WO</th>
            <th>cab name</th>
            <th v-if="!state.changeData">del</th>
          </tr>
          <tr v-for="(value, index) in state.cabinets" :key="index">
            <!-- <td v-if="!state.changeData">
              <input v-model="state.cabinets[index]!.wo" type="text" />
            </td>-->

            <td>{{ value!.wo }}</td>

            <!-- <td v-if="!state.changeData">
              <input v-model="state.cabinets[index]!['cab name']" required type="text" />
            </td>-->

            <td class="cabtime__name">
              <div>
                <p>{{ value!['cab name'] }}</p>
              </div>
            </td>

            <td v-if="!state.changeData">
              <div class="close" @click="deleteRowAttention(value.wo, index)">&#x270D;</div>
            </td>
          </tr>
        </tbody>
      </table>

      <h3>Добавить WO</h3>
      <table>
        <colgroup>
          <col span="1" class="collgroup1" />
          <col span="1" class="collgroup2" />
          <col v-if="!state.changeData" span="1" class="collgroup3" />
        </colgroup>
        <tbody>
          <tr class="head">
            <th>WO</th>
            <th>cab name</th>
            <th v-if="!state.changeData">del</th>
          </tr>
          <tr v-for="(value, index) in state.newCabinets" :key="index">
            <td>
              <input v-model="state.newCabinets[index]!.wo" type="text" />
            </td>
            <td>
              <input v-model="state.newCabinets[index]!['cab name']" required type="text" />
            </td>
            <td v-if="!state.changeData">
              <div class="close" @click="deleteRow(index)">&#10060;</div>
            </td>
          </tr>
          <div v-if="!state.changeData" class="add__row" @click="addNewRow">+</div>
        </tbody>
      </table>
    </div>
    <input class="add__button" type="submit" value="submit" />
  </form>
  <teleport to="body">
    <confirm-popup :opened="state.popupOpened" @closed="popupClosed" @confirm="popupConfirmed">
      <template #header>
        <h3>Редактировать WO</h3>
        <p
          class="popup__description"
        >Если к WO уже привязан CabTime или добавлены ошибки, они так же будут удалены.</p>
      </template>
      <template #select>
        <div class="popup__change">
          <p>WO</p>
          <input v-model="state.choosenWO.wo" type="text" />
          <p>Cab name</p>
          <input v-model="state.choosenWO['cab name']" required type="text" />
        </div>

        <!-- state.choosenWO -->
        <!-- <button class="cancel" @click="popupClosed">Отмена</button>
        <button class="confirm" @click="confirm">Да</button>-->
      </template>
      <template #buttons>
        <button
          class="popup__cancel__button"
          @click="updateElements(state.choosenWO.wo)"
        >Обновить WO</button>
        <button
          class="popup__confirm__button"
          @click="deleteElements(state.choosenWO.wo)"
        >Удалить WO</button>
      </template>
    </confirm-popup>
  </teleport>
</template>

<script setup lang="ts">
import { useFetch } from '@/hooks/fetch'
import { useRoute, useRouter } from 'vue-router'
import { watch, ComputedRef, computed, ref, reactive } from '@vue/runtime-core'
import renderInputs from '@/components/renderInputs'
import { projectInfoType } from '@/types/projectInfoType'
import { getAuthGraph } from '@/hooks/useGraph'
import { templateType } from '@/types/templateType'
import { useStore } from 'vuex'
import { projectType } from '@/types/projectType'
import confirmPopup from '@/components/modal/cunfirmPopup.vue'

type cabinetInfo = {
  "id": string,
  "type": string,
  "info": {
    "wo": string,
    "cab name": string,
    "project number": string,
    "Project Name": string,
    "status": string
  },
}

const router = useRouter()
const route = useRoute()
const store = useStore()
const state = reactive({
  errorMessage: '',
  popupOpened: false,
  project: <projectType>{},
  choosenWO: <projectType['cabinets'][0]>{},
  modelObject: <projectInfoType>{},
  extend: <templateType['template']['extendManual']>{},
  changeData: false,
  cabinets: <projectType['cabinets']>[],
  newCabinets: <projectType['cabinets']>[]
})

if (route.query.projectID) {
  // state.changeData = false
  getProject()
}
let choosenIndex = 0
//DEEP COPY
state.extend = JSON.parse(JSON.stringify(store.state.template.template.extendManual))
//MOD OBJECT TO V-MODEL
let arr = []
for (const key in state.extend) {

  arr.push([key, ''])
}
state.modelObject = Object.fromEntries(arr)


// const extendStore = computed(() => store.state.template.template.extendManual)
// const copy: ComputedRef<templateType['template']['extendManual']> = computed(() => JSON.parse(JSON.stringify(extendStore.value)))


const { getToken, token } = getAuthGraph()

const tryGetToken = async () => {
  await getToken()
}
token && tryGetToken()


async function getProject() {
  const { request, response } = useFetch<projectType>(
    `/api/projects?status=${route.query.status ? 'closed' : 'open'
    }&project=${route.query.projectID}`
  )
  if (Object.keys(state.project).length === 0) {
    await request()
    state.project = response.value!
    state.modelObject = { ...state.project.info.base, ...state.project.info.extends, 'Project Number': state.project.id }
    state.cabinets = state.project.cabinets
    // state.resCabinets = response.value!.cabinets
  }
}



const searchPeople = async (key: keyof projectInfoType, event: Event) => {

  if (!(event.target instanceof HTMLInputElement)) return

  state.modelObject[key] = event.target.value

  state.extend[key].search = (await reqGraph(token.value!.accessToken, `https://graph.microsoft.com/v1.0/me/people/?$search=${event.target.value}`)).value

}
const choosePeople = (key: keyof projectInfoType, el: string) => {
  state.modelObject[key] = el
  state.extend[key].search = undefined
}





// eslint-disable-next-line no-undef
const reqGraph = async (token: string, url: RequestInfo) => {

  const headers = new Headers();
  const bearer = `Bearer ${token}`;

  headers.append("Authorization", bearer);

  // eslint-disable-next-line no-undef
  const options: RequestInit = {
    method: "GET",
    headers: headers,
    redirect: 'follow'
  };

  const resGraph = await fetch(
    url,
    options
  )
  const response = await resGraph.json()
  return response
}

const postProject = async () => {
  const { request, response } = useFetch('/api/POST_project', {
    method: 'POST', // или 'PUT'
    body: JSON.stringify({
      id: state.modelObject['Project Number'],
      status: 'open',
      info: {
        base: {
          'Project Name': state.modelObject['Project Name'],
          'SZ №': state.modelObject['SZ №'],
          PM: state.modelObject['PM'],
          Buyer: state.modelObject['Buyer'],
          'Contract Administrator': state.modelObject['Contract Administrator'],
          'Buyout Administrator': state.modelObject['Buyout Administrator'],
          'Lead Engineer': state.modelObject['Lead Engineer'],
        },
        extends: {
          'Specific requirement field':
            state.modelObject['Specific requirement field'],
          'status project': state.modelObject['status project'],
          'senior fitter': state.modelObject['senior fitter'],
          'Comments field': state.modelObject['Comments field'],
          'Shipping date': state.modelObject['Shipping date'],
          "Hours calculated": state.modelObject['Hours calculated'],
          "Hours actual": state.modelObject['Hours actual'],
        },
      },
      cabinets: state.cabinets,
    }),
  })
  await request()
  state.extend = <templateType['template']['extendManual']>{}
  state.cabinets = []
  router.back()
}
const addNewRow = () => {
  state.newCabinets.push({
    wo: '',
    'cab name': '',
  })
}
const deleteRow = (index: number) => {

  state.newCabinets.splice(index, 1)
}

const deleteRowAttention = async (wo: string, index: number) => {
  // debugger
  state.popupOpened = true
  state.choosenWO = state.cabinets.find(e => e.wo === wo)!
  choosenIndex = index


  // state.cabinets.splice(index, 1)
}

const popupClosed = () => {
  state.popupOpened = false
}
const popupConfirmed = async () => {
  // await deleteCabTime()
  state.popupOpened = false
  // state.popupOpened = false
}
const deleteElements = async (wo: string) => {
  try {
    await store.dispatch('GET_cabinetItemsPure', wo)

    Promise.all(store.state.cabinetItems.map(async e => {
      e.ttl = 2
      const { request: postDeleteEl } = useFetch('/api/post_item', {
        method: 'post',
        body: JSON.stringify(e),
      })
      await postDeleteEl()
      return e
    }))
  } catch (error) {
    console.log(error);
  }
}



const updateElements = async (wo: string) => {
  //check if wo is exist

  const { request: reqCabinetInfo, response: resCabinetInfo } = useFetch<cabinetInfo>(
    `/api/getitembyid/info__${wo}`
  )
  try {
    await reqCabinetInfo()
    //here wo with this number already exists
    alert('WO already exist')
    state.errorMessage = 'WO already exist'
    return
  } catch (error) {
    console.log('first check paste');
    try {
      await store.dispatch('GET_cabinetItemsPure', wo)

      Promise.all(store.state.cabinetItems.map(async e => {
        e.info.wo = wo
        e.info.Шкаф = state.choosenWO['cab name']
        if (e.type === 'info') {
          e.info['cab name'] = state.choosenWO['cab name']
        }
        const { request: postUpdateEl } = useFetch('/api/post_item', {
          method: 'post',
          body: JSON.stringify(e),
        })
        //UPDATE ELEMENTS
        try {
          await postUpdateEl()
        } catch (error) {
          console.log(error, 'error in update elements');
        }
        return e
      }))
      //replace our object
      state.cabinets.splice(choosenIndex, 1)
      state.cabinets.push(state.choosenWO)
      //UPDATE PROJECT
      const { request: postProject, response } = useFetch('/api/POST_project', {
        method: 'POST', // или 'PUT'
        body: JSON.stringify({ ...state.project, cabinets: state.cabinets })
      })
      try {
        await postProject()
      } catch (error) {
        console.log(error, 'postProjectError');

      }

    } catch (error) {
      console.log(error, 'Oops, fatalError');
    }
  }

}
</script>

<style lang="css" scoped>
.searchRes {
  grid-area: 2/2/3/3;
  width: 100%;
}
.searchRes p {
  cursor: pointer;
  display: block;
  margin-top: 4px;
  padding: 2px 0px;
  border: 1px solid darkgray;
  border-radius: 3px;
}
.searchRes p:hover {
  background-color: rgb(242 246 255);
}
.add__row {
  display: inline-block;
  border: 1px solid orange;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  margin: 6px;
  font-size: 30px;
  line-height: 1;
}
.add__row:hover {
  color: white;
  background-color: orange;
}
.add__button {
  margin: auto;
  width: 50%;
  height: 30px;
  margin-top: 15px;
  margin-bottom: 15px;
  background-color: rgb(255, 164, 59);
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
  width: min(800px, 95vw);
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
.error__item {
  border-bottom: 1px solid black;
  padding: 2px;
  padding-top: 6px;
  padding-bottom: 6px;
  display: grid;
  align-items: center;
  grid-template-columns: 2fr 3fr;
}
td input {
  width: 90%;
  margin: auto;
}
.close {
  cursor: pointer;
}
.collgroup1 {
  width: 30%;
}
.collgroup2 {
  width: 60%;
}
.collgroup3 {
  width: 10%;
}
.popup__description {
  padding: 10px 1vw;
  color: red;
  width: max(25vw, 250px);
  margin: auto;
}
.popup__change {
  display: grid;
  width: 95%;
  margin: auto;
  grid-template-columns: auto 3fr;
  place-items: center;
  gap: 0.5vw;
  padding: 10px 0;
}
.popup__change input {
  width: 100%;
  margin-top: 5px;
}
.popup__change p {
  justify-self: end;
}
</style>
