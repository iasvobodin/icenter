<template>
  <table>
      <tr style="border: solid 2px orange">
          <th>№</th>
          <th>Наименование</th>
          <th>Кол-во</th>
          <th>Норма</th>
          <th>Итого</th>
      </tr>
      <tr v-for="(value, key, index) in  $store.state.template&&$store.state.template.CabTime" :key="index">
          <td>{{ value._id }}</td>
          <td class="cabtime__name">{{ value.name }}</td>
          <td class="tg-0lax"><input v-model="cabtimeVal[value.name]" class="cabtime__input" type="number"></td>
          <td class="tg-0lax">{{ value._const }}</td>
          <td  class="tg-0lax"> <div v-show="result(value._const,cabtimeVal[value.name])">{{result(value._const,cabtimeVal[value.name]) }}</div> </td>
      </tr>
  </table>
             <!-- <div v-for="(value, key, index) in $store.state.template.CabTime" :key="index">
                 {{value.name}}___{{value._const}}  -->
            <!-- <div>
              <h3>Статус ошибки: {{ key }}</h3>-->
              <!-- <conditional-render  :data-render="value" /> -->
          <!-- </div> -->
</template>

<script>
import conditionalRender from "@/components/conditionalRender.vue";
import chooseWoNumber from '@/components/chooseWoNumber.vue';
import { useStore } from 'vuex';
import {
    reactive,
    toRefs, computed,nextTick,
} from 'vue'
export default {
    components: {
        chooseWoNumber,
        conditionalRender,
    },
    setup() {
        const store = useStore()
        const cabtimeVal = reactive({})
        const state = reactive({type: null})
        const result = (a,b)=> Math.ceil(a*b) 
        state.type = store.state.template&&store.state.template.CabTime.reduce((acc, el) => acc.add(el._type) ,new Set())
        (async () => { 
            await nextTick();
            console.log(store.state.template.CabTime)
            }
            )();
            // [...state.errors.reduce((acc, pr) => acc.add(pr.info.extends['status project']),new Set())].sort()
        return {result,
            cabtimeVal, ...toRefs(state)
        }
    }
} 
</script>

<style lang="css" scoped>
.cabtime__name{
    text-align: start;
}
.cabtime__input{
    width: min(100%, 60px);
}
table {
    margin: auto;
  margin-top: 2vh;
  border-collapse: collapse;
  border-radius: 5px;
  min-width: min(95vw, 800px);
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