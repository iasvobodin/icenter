<template>
<h1>Проекты.</h1>
<p>В данном разделе можно добавлять и редактировать информацию по текущим проектам ICenter.</p>
  <br>
  <input v-model="search" type="text" placeholder="мастер или номер проекта">
  <br>
  <br>
  <div v-if="errors">
    <div v-for="status in actualStatus" v-show="groupProjects(status).length != 0" :key="status" >
      <h2>{{status}}</h2>
      <div class="errors__holder">
        <div v-for="(value, key, index) in groupProjects(status)" :key="index"
          class="error__card__holder" @click="$router.push(`/projects/${value.id}`)">
          <br  class="errors__card">
          <div  class="errors__card">
            <h2>{{ value.id }}</h2>
            <p class="project__name" >{{ value.info.base['Project Name'] }}</p>
            <br>
            <p> <i>Количество шкафов</i> : {{ value.cabinets.length }}</p>
            <br>
            <p> <i>Мастер</i> : {{ value.info.extends['senior fitter']&&value.info.extends['senior fitter'].split('@')[0].replace('.',' ') }}</p>
          </div>
        </div>
      </div>
      <br>
      <hr>
    </div>
    <router-link to="/projects/addnewproject">
<img class="add__button" src="/img/add.svg" alt="Добавить новый проект">
</router-link>
  </div>
  <section v-if="errors" class="table">
  <table style="width: 150%">
    <!-- <tr style="border: solid 2px orange">
      <th>WO</th>
      <th>Наименование</th>
    </tr> -->
     <tr style="border: solid 2px orange">
      <th>{{ errors[0].id }}</th>
      <th v-for="(v, k) in errors[0].info.base" >{{k}}</th>
      <th v-for="(vv,kk) in errors[0].info.extends" >{{kk}}</th>
    </tr>
    <tr v-for="(value, key, index) in errors" :key="index">
      <td>{{ value.id }}</td>
      <td v-for="v in value.info.base" >{{v}}</td>
      <td v-for="vv in value.info.extends" >{{vv}}</td>
    </tr>
  </table>
  </section>
</template>

<script>

import infoRender from '@/components/infoRender.vue'
import { reactive, toRefs, computed, ref } from 'vue'
import { useFetch } from '@/hooks/fetch'

export default {
  components: {
    infoRender,
  },
  setup() {
    const state = reactive({
      errors: null,
      resErrors: null,
      fetchStatus: null,
      errorMessage: '',
      actualStatus: null,
      search:"",
      testStatus : {}
    })
    
    const filterProjects = computed(() => {
      //  debugger
      return state.search ?
        state.errors.filter(e => [e?.id, e.info.extends?.['senior fitter']].some(s => s && s.toLowerCase().includes(state.search.toLowerCase()))) :
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

      state.actualStatus = [...state.errors.reduce((acc, pr) => acc.add(pr.info.extends['status project']),new Set())].sort()

      state.errors.sort(function (a, b) {
        const nameA = a.info.extends['status project'].toLowerCase();
        const nameB = b.info.extends['status project'].toLowerCase();
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

    return {
      groupProjects,
      filterProjects,
      ...toRefs(state),
    }
  },
}
</script>

<style lang="css" scoped>

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

input {
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
}

.error__card__holder {
  place-self: stretch;

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
  padding: 0.5rem;
  font-size: 12px;
}
tbody tr:nth-child(odd) {
  background: #eee;
}
tbody tr:hover {
  background: yellow;
}
</style>