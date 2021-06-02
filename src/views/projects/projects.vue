<template>
<br>
  <div v-if="errors" class="errors__holder">
    <div
      v-for="(value, key, index) in errors"
      :key="index"
      class="errors__card"
      @click="$router.push(`/projects/${value.id}`)"
    >
      <h2>{{ value.id }}</h2>
      <p>{{ value.info.base['Project Name'] }}</p>
      <br>
      <p>Количество шкафов {{ value.cabinets.length }}</p>
      <br>
       <p>Статус{{ value.info.extends['status project'] }}</p>
      <!-- <info-render :info-data="value.info.base" />
    <info-render :info-data="value.info.extends" /> -->
    </div>
  </div>
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
    })
    
    // const ordered = computed(() => {
    //   if (state.errors) {
    //     const ord = Object.keys(state.errors.info.extends).sort().reduce(
    //       (obj, key) => {
    //         obj[key] = state.errors.info.extends[key];
    //         return obj;
    //       }, {}
    //     )
    //     return ord
    //   }
    //   return 'sort'
    // })
    const getErrors = async () => {
      const {
        request,
        response
      } = useFetch(`/api/projects?status=open`)
      await request()
      state.errors = response

      const status = state.errors.reduce((acc, pr) => acc.add(pr.info.extends['status project']),new Set())
         let arr = []
       const groupByStatus = state.errors.reduce((acc, pr) => {
         acc[pr.info.extends['status project']] = pr
        //  [...status].forEach(st =>{
        //   //  if(pr.info.extends['status project'] === st){}
        // //  })
        //  acc.add(pr.info.extends['status project'])
         },{})
console.log( groupByStatus);
      state.errors.sort(function (a, b) {
        const nameA = a.info.extends['status project'].toLowerCase();
        const nameB = b.info.extends['status project'].toLowerCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        // names must be equal
        return 0;
      });
    }
    getErrors()

    return {
      //ordered,
      ...toRefs(state),
    }
  },
}
</script>

<style lang="css" scoped>
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
  width: 98%;
  margin: auto;
  grid-template-columns: repeat(auto-fill, minmax(max(25vw, 250px), 1fr));
  column-gap: 2vh;
  row-gap: 2vh;
}
.errors__card {
  border: 1px solid orange;
  border-radius: 4px;
  padding: 5px;
  cursor: pointer;
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
</style>