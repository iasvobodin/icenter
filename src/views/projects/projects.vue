<template>
  <h1>Проекты.</h1>
  <p>В данном разделе можно добавлять и редактировать информацию по текущим проектам ICenter.</p>
  <br>
  <input id="select__filter" v-model="search" type="text" placeholder="SF, PM, №">
  <br>
  <br>
  <div v-if="errors">
    <div v-for="status in actualStatus" v-show="groupProjects(status).length != 0" :key="status">
      <!-- <hr style="margin:0;"> -->
      <h3 class="project__status">{{status?.split('-')[1].split('/')[0]}}</h3>
      <div class="errors__holder">
        <div v-for="(value, key, index) in groupProjects(status)" :key="index" class="error__card__holder"
          @click="$router.push(`/projects/${value.id}`)">
          <div class="errors__card">
            <div class="double">
             <h2>{{value.id}}:</h2><p>{{value.info.base['Project Name']}}</p>
            </div>
            <hr style="margin:0;">
            <!-- <info-render :info-data="{[value.id]: value.info.base['Project Name']}" /> -->
            <div class="double">
              <info-render :info-data="{'PM': value.info.base?.PM}" />
              <info-render :info-data="{'SF': value.info.extends['senior fitter']?.split('@')[0].split('.')[1]}" />
            </div>
             <div class="double">
            <info-render :info-data="{'Отгрузка': value.info.extends['Shipping date']}" />
            <info-render :info-data="{'QTY': value.cabinets.length}" />
             </div>
            <info-render :info-data="{'Comments': value.info.extends['Comments field']}" />
            <!-- <h2></h2> -->
            <!-- <p class="props"> <b>{{ value.id }}</b> {{ value.info.base['Project Name'] }}
            </p>
            <p class="props"> <b>PM</b> :
              {{ value.info.base?.PM }} <b>SF</b> :
              {{value.info.extends['senior fitter']?.split('@')[0].replace('.',' ') }}
            </p>
            <p class="props"> <b>Отгрузка</b> : {{ value.info.extends['Shipping date']}} <b
                style="text-align: right;">QTY </b> : {{ value.cabinets.length }}
            </p> -->
            <!-- <p class="props"> <b>Comments field</b> : {{ value.info.extends['Comments field']}}</p> -->
          </div>
        </div>
      </div>
      <br>
      <!-- <hr> -->
    </div>
    <router-link to="/projects/addnewproject">
      <img class="add__button" src="/img/add.svg" alt="Добавить новый проект">
    </router-link>
  </div>

  <section v-if="changeAllFlag" class="table">
    <table style="width:100%">
      <colgroup>
        <col span="1" style="width: 6%;">
        <col span="1" style="width: 10%;">
        <col span="1" style="width: 10%;">
        <col span="1" style="width: auto;">
        <col span="1" style="width: auto;">
        <col span="1" style="width: 6%;">
        <col span="1" style="width: 6%;">
        <col span="1" style="width: 6%;">
      </colgroup>
      <tr style="border: solid 2px orange">
        <th>№</th>
        <th v-for="(vv,kk) in $store.state.template.template.extend" :key="kk" @click="sortBy(kk,'extends')">{{kk}}</th>
      </tr>
      <tbody>
        <tr v-for="(value, key, index) in projects" :key="index" @click="getIndex(key)">
          <td>
            <h2 class="project__number">{{ value.id }}</h2>
          </td>
          <td v-for="(v,k) in $store.state.template.template.extend" :key="k">
            <!-- <conditional-render v-model="projects[key].info.extends" :only-field="false"
              :data-render="{[k]:$store.state.template.template.extend[k]}" :required="false" /> -->
            <render-inputs v-model="projects[key].info.extends"
              :data-render="$store.state.template.template.extend[k]" />
          </td>
        </tr>
      </tbody>
    </table>
  </section>
  <br>
  <br>
  <button v-if="!changeAllFlag&&errors" @click="changeAllFlag = !changeAllFlag">Change ALL</button>
  <button v-else @click="updateChangedProjects">Update</button>
  <br>
  <br>
</template>

<script>

// import infoRender from '@/components/infoRender.vue'
import { reactive, toRefs, computed, ref } from 'vue'
import { useFetch } from '@/hooks/fetch'
import infoRender from "@/components/infoRender.vue";
// import conditionalRender from '@/components/conditionalRender.vue'
import renderInputs from '@/components/renderInputs.js'
export default {
  components: {
    // conditionalRender,
    renderInputs,
    infoRender,
  },
  setup() {
    const state = reactive({
      changeAllFlag: false,
      errors: null,
      resErrors: null,
      fetchStatus: null,
      errorMessage: '',
      actualStatus: null,
      search:"",
      testStatus : {},
      projects:null,
      updateIndex: new Set(),
    })
    const getIndex = (i) => state.updateIndex.add(i);

    const filterProjects = computed(() => {
      //  debugger
      return state.search ?
        state.errors.filter(e => [e?.id, e.info.base?.PM, e.info.extends?.['senior fitter']].some(s => s && s.toLowerCase().includes(state.search.toLowerCase()))) :
        state.errors

    })
    const groupProjects = status =>filterProjects.value && filterProjects.value.filter( f => f.info.extends['status project'] === status )
    
    const getErrors = async () => {
      const {
        request,
        response
      } = useFetch(`/api/projects?status=open`)
      await request()
      state.errors = response
      state.projects = JSON.parse(JSON.stringify(state.errors))

      state.actualStatus = [...state.errors.reduce((acc, pr) => acc.add(pr.info?.extends['status project']),new Set())].sort()

      state.errors.sort(function (a, b) {
        const nameA = a.info.extends['status project']?.toLowerCase();
        const nameB = b.info.extends['status project']?.toLowerCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
    }
    getErrors()
// console.log(Array.from({ length: 20 }).map(()=> ));
        const postProject = async (index) => {
      const { request, response } = useFetch('/api/POST_project', {
        method: 'POST', // или 'PUT'
        body: JSON.stringify({...state.projects[index]}),
      });
      await request()
    }
     const updateChangedProjects = async () => {
     await Promise.all([...state.updateIndex].map(async e => {
       await postProject(e)
     }))  
     state.changeAllFlag = !state.changeAllFlag
     getErrors()
     }
const sortBy = (el,p) => {
  // console.log(el,p);
  // debugger
        state.projects.sort(function (a, b) {
        const nameA = a.info[p][el]?.toString().toLowerCase();
        const nameB = b.info[p][el]?.toString().toLowerCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      })
}
    return {
      updateChangedProjects,
      getIndex,
      sortBy,
      groupProjects,
      filterProjects,
      ...toRefs(state),
    }
  },
}
</script>

<style lang="css" scoped>

.project__number{
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
  bottom: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  cursor: pointer;
}



.selectStatus>h3 {
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
  column-gap: 2vh;
  row-gap: 2vh;
}

.errors__card {
  border: 1px solid orange;
  border-radius: 4px;
  padding: 5px;
  cursor: pointer;
  min-height: 150px;
  height: 100%;
  overflow: hidden;
}


.error__card__holder {
  place-self: stretch;
  height: 100%;

}

.errors__card:hover {
  border: 1px solid black;
  background: rgba(245, 254, 255, 0.356);
}

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
th{
   position: sticky;
  top: 50px;
  color: white;
  background-color: rgb(0, 68, 129);
  border: solid 2px orange;
  box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4);
}
tr>th{
  cursor: pointer;
}
input[type="number"],
input[type="text"]{
  width: 100%;
  text-align: center;
}
textarea{
  height: 90px;
}
#select__filter{
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
.project__status{
  position: sticky;
  top: 50px;
  background-color: #004481;
  color: white;
  margin: 1vh auto;
  border-radius: 5px;
  /* width: min(700px, 95%); */
  padding: 0.5vh;
  font-size: min(20px 5vw );
  /* transform: translateY(-50%); */
}
.props{
margin-top: 5px;
border-bottom: 1px solid black;

}
.props:last-child {
border-bottom: 1px solid white;
text-align: left;

}
.double{
    display: grid;
    grid-auto-flow: column;
    column-gap: 1vw;
    grid-template-columns: 5fr 4fr;
    justify-content: space-between;
}
.double:first-child{
    display: grid;
    grid-auto-flow: column;
    column-gap: 1vw;
    grid-template-columns: 1fr 4fr;
    justify-content: space-between;
    margin-bottom: 1vh;
}
.double:first-child>p{
    place-self: center;
        white-space: pre-wrap;
  word-wrap: break-word;
}


</style>