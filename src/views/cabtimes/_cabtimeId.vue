<template>
    <div v-for="t in getType">
        <!-- <h3>{{t}} </h3> -->
        <table>
                <colgroup>
       <col span="1" style="width: 5%;">
       <col span="1" style="width: 70%;">
       <col span="1" style="width: 15%;">
        <col span="1" style="width: 5%;">
         <col span="1" style="width: 5%;">
    </colgroup>
<tbody>
            <tr style="border: solid 2px orange">
                <th>№</th>
                <th>{{t}}</th>
                <th>Кол-во</th>
                <th>Норма</th>
                <th>Итого</th>
            </tr>
            <tr v-for="(value, key, index) in  groupBy(t)"  :key="index">
                <td>{{ value._id }}</td>
                <td class="cabtime__name">{{ value.name }}</td>
                <td class="tg-0lax"><input v-model="$store.state.template.CabTime[value.name]" class="cabtime__input" type="number"></td>
                <td class="tg-0lax">{{ value._const }}</td>
                <td class="tg-0lax">
                    <div v-show="cabtimeVal[value.name]">{{result(value._const,cabtimeVal[value.name]) }}</div>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
    <br>
    <button @click="postCabTime">SEND</button>
    <br>
    <br>
</template>

<script>
import conditionalRender from "@/components/conditionalRender.vue";
import chooseWoNumber from '@/components/chooseWoNumber.vue';
import {
    useStore
} from 'vuex';
import {
    reactive,
    toRefs,
    computed,
    nextTick,
} from 'vue'
export default {
    components: {
        chooseWoNumber,
        conditionalRender,
    },
    setup() {
        const store = useStore()
        const cabtimeVal = reactive({})
        const state = reactive({
            type: null,
            tt: null
        })
        const result = (a, b) => Math.ceil(a * b)
        // const copyTemplate = computed(() => {return 
        store.state.template && (state.tt = store.state.template.CabTime)
        // })
        const getType = computed(() => store.state.template && store.state.template.CabTime.reduce((acc, el) => acc.add(el._type), new Set()))
        const groupBy = t => { return store.state.template && store.state.template.CabTime.filter(g => g._type === t)}

        const postCabTime = async () => {
            console.log(store.state.template.CabTime.filter(f => Object.keys(cabtimeVal).some(s => f.name === s)  ).map(m => cabtimeVal.find(e => e)  ));
            // Object.keys(cabtimeVal).some(s => store.state.template.CabTime.filter(f => f.name === s) )
            // store.state.template.CabTime
        }
        return {
            getType,groupBy,postCabTime,
            result, // filterByGroup,
            cabtimeVal,
            ...toRefs(state)
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
  width: min(95vw, 800px);
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
  background: rgba(255, 166, 0, 0.1);
}
</style>