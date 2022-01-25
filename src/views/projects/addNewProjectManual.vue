<template>
  <form class="project__info project__holder" @submit.prevent="postProject">
    <h1>Adding a project manually</h1>
    <br />
    <div
      v-for="(v, k, i) in $store.state.template.template.extendManual"
      :key="i"
      class="error__item"
    >
      <h4>{{ k }}</h4>
      <div v-if="v._field === 'search'">
        <div class="error__item">
          <!-- <h4>{{ k }}</h4> -->
          <input :value="v.value" type="text" @input="searchPeople(k, $event)" />
          <!-- <div class="searchRes">
            <p
              v-for="(user, index) in selected.extend[k].search"
              :key="index"
              class="search__result"
              @click="choosePeople(k, user.userPrincipalName)"
            >{{ user.userPrincipalName }}</p>
          </div>-->
        </div>
      </div>
      <render-inputs v-else v-model.lazy="selected.extend" :required="true" :data-render="v" />
    </div>

    <!-- <div v-for="(v, k, i) in selected.projectSearchReople" :key="i" class="error__item">
      <h4>{{ k }}</h4>
      <input
        :value="selected.projectSearchReople[k].value"
        type="text"
        @input="searchPeople(k, $event)"
      />
      <div class="searchRes">
        <p
          v-for="(user, index) in selected.projectSearchReople[k].search"
          :key="index"
          class="search__result"
          @click="choosePeople(k, user.userPrincipalName)"
        >{{ user.userPrincipalName }}</p>
      </div>
    </div>-->

    <div class="cabinets">
      <br />
      <br />
      <div v-for="(item, i) in selected.cabinets" :key="i">
        wo
        <input v-model="selected.cabinets[i].wo" required type="text" /> cab
        name
        <input v-model="selected.cabinets[i]['cab name']" required type="text" />
        <br />
        <br />
      </div>
      <div class="add__row" @click="addNewRow">+</div>
    </div>
    <input class="add__button" type="submit" value="submit" />
  </form>
</template>

<script setup lang="ts">
import { useFetch } from '@/hooks/fetch'
import { useRouter } from 'vue-router'
import { watch, computed, ref, reactive } from '@vue/runtime-core'
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
  extend: <templateType['template']['extendManual']>{},
  cabinets: [
    {
      wo: '',
      'cab name': '',
    },
  ],
  token: '',
  projectSearchReople: {
    'PM': { search: [{ id: "", userPrincipalName: "" }], value: '' },
    'Buyer': { search: [{ id: "", userPrincipalName: "" }], value: '' },
    'Contract Administrator': { search: [{ id: "", userPrincipalName: "" }], value: '' },
    'Buyout Administrator': { search: [{ id: "", userPrincipalName: "" }], value: '' },
    'Lead Engineer': { search: [{ id: "", userPrincipalName: "" }], value: '' },
  }
})
const extendStore = computed(() => store.state.template.template.extendManual)
const copy = computed(() => JSON.parse(JSON.stringify(extendStore.value)))


const { getToken, token } = getAuthGraph()

const searchPeople = async (key: keyof projectInfoType, event: Event) => {
  if (!(event.target instanceof HTMLInputElement)) return

  copy[key].value = event.target.value
  // selected.projectSearchReople[key].value = event.target.value

  copy[key].search = (await reqGraph(selected.token, `https://graph.microsoft.com/v1.0/me/people/?$search=${event.target.value}&Select=userPrincipalName`)).value

}
const choosePeople = (k: keyof projectInfoType, el: string) => {
  selected.extend[k].value = el
  selected.extend[k].search = [{ id: "", userPrincipalName: "" }]
}
const tryGetToken = async () => {

  await getToken()
  selected.token = token.value!.accessToken
}
!selected.token && tryGetToken()


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


  // const myHeaders = new Headers()
  // myHeaders.append('Authorization', `Bearer ${token}`)

  // // eslint-disable-next-line no-undef
  // const requestOptions: RequestInit = {
  //   method: 'GET',
  //   headers: myHeaders,
  //   redirect: 'follow',
  // }

  const resGraph = await fetch(
    url,
    options
  )
  const rrr = await resGraph.json()
  return rrr
}


watch(() => selected.search, async (newValue, oldValue) => {
  selected.resSearch = await reqGraph(selected.token, `https://graph.microsoft.com/v1.0/me/people/?$search=${newValue}&Select=userPrincipalName`)

})

const postProject = async () => {
  const { request, response } = useFetch('/api/POST_project', {
    method: 'POST', // или 'PUT'
    body: JSON.stringify({
      id: selected.extend['Project Number'].value.includes('.') && typeof selected.extend['Project Number'].value === 'string'
        ? selected.extend['Project Number'].value.replace('.', ',')
        : selected.extend['Project Number'].value,
      status: 'open',
      info: {
        base: {
          'Project Name': selected.extend['Project Name'],
          'SZ №': selected.extend['SZ №'],
          PM: selected.extend['PM'],
          Buyer: selected.extend['Buyer'],
          'Contract Administrator': selected.extend['Contract Administrator'],
          'Buyout Administrator': selected.extend['Buyout Administrator'],
          'Lead Engineer': selected.extend['Lead Engineer'],
        },
        extends: {
          'Specific requirement field':
            selected.extend['Specific requirement field'],
          'status project': selected.extend['status project'],
          'senior fitter': selected.extend['senior fitter'],
          'Comments field': selected.extend['Comments field'],
          'Shipping date': selected.extend['Shipping date'],
        },
      },
      cabinets: selected.cabinets.filter((f) => f.wo),
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
