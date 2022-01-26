<template>
  <form class="project__info project__holder" @submit.prevent="postProject">
    <h1>Adding a project manually</h1>
    <br />
    <div v-for="(v, k, i) in selected.extend" :key="i" class="error__item">
      <h4>{{ k }}</h4>
      <div v-if="v._field === 'search'">
        <input
          required
          style="width: 100%;"
          :value="selected.modelObject[k]"
          type="text"
          @input="searchPeople(k, $event)"
        />
        <div class="searchRes">
          <p
            v-for="(user, index) in selected.extend[k].search"
            :key="index"
            class="search__result"
            @click="choosePeople(k, user.userPrincipalName)"
          >{{ user.userPrincipalName }}</p>
        </div>
      </div>
      <render-inputs v-else v-model.lazy="selected.modelObject" :required="true" :data-render="v" />
    </div>
    <div class="cabinets">
      <br />
      <br />
      <div v-for="(item, i) in selected.cabinets" :key="i">
        wo
        <input v-model="selected.cabinets[i].wo" type="text" /> cab
        name
        <input v-model="selected.cabinets[i]['cab name']" required type="text" />
        <br />
        <br />
      </div>
      <div class="add__row" @click="addNewRow">+</div>
      <div class="add__row" @click="deleteRow">-</div>
    </div>
    <input class="add__button" type="submit" value="submit" />
  </form>
</template>

<script setup lang="ts">
import { useFetch } from '@/hooks/fetch'
import { useRouter } from 'vue-router'
import { watch, ComputedRef, computed, ref, reactive } from '@vue/runtime-core'
import renderInputs from '@/components/renderInputs'
import { projectInfoType } from '@/types/projectInfoType'
import { getAuthGraph } from '@/hooks/useGraph'
import { templateType } from '@/types/templateType'
import { useStore } from 'vuex'


const router = useRouter()
const store = useStore()
const selected = reactive({
  search: "",
  resSearch: null as any,
  modelObject: <Record<keyof templateType['template']['extendManual'], string>>{},
  extend: <templateType['template']['extendManual']>{},
  cabinets: [
    {
      wo: '',
      'cab name': '',
    },
  ],
  token: '',
  // projectSearchReople: {
  //   'PM': { search: [{ id: "", userPrincipalName: "" }], value: '' },
  //   'Buyer': { search: [{ id: "", userPrincipalName: "" }], value: '' },
  //   'Contract Administrator': { search: [{ id: "", userPrincipalName: "" }], value: '' },
  //   'Buyout Administrator': { search: [{ id: "", userPrincipalName: "" }], value: '' },
  //   'Lead Engineer': { search: [{ id: "", userPrincipalName: "" }], value: '' },
  // }
})

//DEEP COPY
selected.extend = JSON.parse(JSON.stringify(store.state.template.template.extendManual))
//MOD OBJECT TO V-MODEL
let arr = []
for (const key in selected.extend) {

  arr.push([key, ''])
}
selected.modelObject = Object.fromEntries(arr)


// const extendStore = computed(() => store.state.template.template.extendManual)
// const copy: ComputedRef<templateType['template']['extendManual']> = computed(() => JSON.parse(JSON.stringify(extendStore.value)))


const { getToken, token } = getAuthGraph()

const tryGetToken = async () => {

  await getToken()
  selected.token = token.value!.accessToken
}
!selected.token && tryGetToken()


const searchPeople = async (key: keyof projectInfoType, event: Event) => {

  if (!(event.target instanceof HTMLInputElement)) return

  selected.modelObject[key] = event.target.value

  selected.extend[key].search = (await reqGraph(selected.token, `https://graph.microsoft.com/v1.0/me/people/?$search=${event.target.value}&Select=userPrincipalName`)).value

}
const choosePeople = (key: keyof projectInfoType, el: string) => {
  selected.modelObject[key] = el
  selected.extend[key].search = [{ id: "", userPrincipalName: "" }]
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
      id: selected.modelObject['Project Number'],
      status: 'open',
      info: {
        base: {
          'Project Name': selected.modelObject['Project Name'],
          'SZ №': selected.modelObject['SZ №'],
          PM: selected.modelObject['PM'],
          Buyer: selected.modelObject['Buyer'],
          'Contract Administrator': selected.modelObject['Contract Administrator'],
          'Buyout Administrator': selected.modelObject['Buyout Administrator'],
          'Lead Engineer': selected.modelObject['Lead Engineer'],
        },
        extends: {
          'Specific requirement field':
            selected.modelObject['Specific requirement field'],
          'status project': selected.modelObject['status project'],
          'senior fitter': selected.modelObject['senior fitter'],
          'Comments field': selected.modelObject['Comments field'],
          'Shipping date': selected.modelObject['Shipping date'],
        },
      },
      cabinets: selected.cabinets,
    }),
  })
  await request()
  selected.extend = <templateType['template']['extendManual']>{}
  selected.cabinets = []
  router.push('/projects')
}
const addNewRow = () => {
  selected.cabinets.push({
    wo: '',
    'cab name': '',
  })
}
const deleteRow = () => {
  console.log('ddd');

  selected.cabinets.splice(-1)
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
}
.searchRes p:hover {
  background-color: rgb(233, 233, 233);
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
</style>
