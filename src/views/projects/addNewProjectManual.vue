<template>
  <form class="project__info project__holder" @submit.prevent="postProject">
    <h1>Adding a project manually</h1><br>
    <div
      class="error__item"
      v-for="(v, k, i) in $store.state.template.template.extendManual"
      :key="i"
    >
      <h4>
        {{ k }}
      </h4>
      <render-inputs
        :required="true"
        v-model.lazy="selected.extend"
        :data-render="v"
      />
    </div>

    <div class="cabinets">
      <br /><br />
      <div :key="i" v-for="(item, i) in selected.cabinets">
        wo <input required v-model="selected.cabinets[i].wo" type="text" /> cab name
        <input required  v-model="selected.cabinets[i]['cab name']" type="text" /><br /><br />
      </div>
                <div class="add__row" @click="addNewRow">
            +
          </div>
    </div>
    <input class="add__button" type="submit" value="submit" />
  </form>
</template>

<script setup>
import { useFetch } from '@/hooks/fetch'
import { useRouter } from 'vue-router'
import { watch, ref, reactive } from '@vue/runtime-core'
import renderInputs from '@/components/renderInputs.js'

const router = useRouter()

const selected = reactive({
  extend: {},
  cabinets: [{
        wo: '',
        'cab name': '',
      }],
})

const postProject = async () => {
  const { request, response } = useFetch('/api/POST_project', {
    method: 'POST', // или 'PUT'
    body: JSON.stringify({
      id: selected.extend['Project Number'].includes('.')
        ? selected.extend['Project Number'].replace('.', ',')
        : selected.extend['Project Number'],
      status: 'open',
    "info": {
        "base": {
            "Project Name": selected.extend['Project Name'],
            "SZ №": selected.extend['SZ №'],
            "PM": selected.extend['PM'],
            "Buyer": selected.extend['Buyer'],
            "Contract Administrator": selected.extend['Contract Administrator'],
            "Buyout Administrator": selected.extend['Buyout Administrator'],
            "Lead Engineer": selected.extend['Lead Engineer']
        },
        "extends": {
            "Specific requirement field": selected.extend['Specific requirement field'],
            "status project": selected.extend['status project'],
            "senior fitter": selected.extend['senior fitter'],
            "Comments field": selected.extend['Comments field'],
            "Shipping date": selected.extend['Shipping date']
        }
    },
      cabinets: selected.cabinets.filter(f => f.wo),
    }),
  })
  await request()
  selected.extend = {}
  selected.cabinets = []
  router.push('/projects')
}
const addNewRow = ()=> {
selected.cabinets.push({
        wo: '',
        'cabinet name': '',
      })
}
</script>

<style lang="css" scoped>
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
