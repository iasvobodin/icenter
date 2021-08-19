<template>
<h2>Расчёт нового CabTime</h2>
    <choose-project-number :data-to-render="projectData" @input-project-event="fetchProjectList"
        @choose-project-number="choose" />
    <div v-if="projectInformation">
        <br>
        <choose-project-number :data-to-render="projectInformation.cabinets.map(e =>e.wo + '   ' +e['cab name'])"
            @choose-project-number="chooseCabinet" />
    </div>
<section v-if="cabinet">
        <div v-for="(t,i) in $store.state.template.CabTimeGroup">
            <table>
                <colgroup>
                    <col span="1" style="width: 5%;">
                    <col span="1" style="width: 70%;">
                    <col span="1" style="width: 10%;">
                    <col span="1" style="width: 10%;">
                    <col span="1" style="width: 5%;">
                </colgroup>
                <tbody>
                    <tr style="border: solid 2px orange">
                        <th>№</th>
                        <th>{{t.name}}</th>
                        <th>Кол-во</th>
                        <th>Норма</th>
                        <th>{{cabtimetype&&cabtimetype[i].summ}}</th>
                        <!-- <th>Index</th> -->
                    </tr>
                    <tr v-for="(value, index) in  groupBy(t.name)" :key="index">
                        <td>
                            {{ value._id }}

                        </td>
                        <td v-if="value.new" class="cabtime__name">
                            <textarea rows="1"></textarea>
                        </td>
                        <td v-else class="cabtime__name">
                            {{ value.name }}
                        </td>
                        <td>
                            <input class="cabtime__input" type="number" :value="value.value" @input="inputData($event, value._id, 'value')">
                        </td>
                        <td v-if="value.new">
                            <input class="cabtime__input" type="number" @input="inputData($event, value._id, '_const')">
                        </td>
                        <td v-else>
                            {{ value._const }}
                        </td>
                        <td>
                            {{tt&&value.result}}
                        </td>
                    </tr>
                    <div class="add__row" @click="addNewRow(t.name)"> + </div>
                </tbody>
            </table>
        </div>
        <table>
            <tbody>
            <tr style="border: solid 2px orange">
                <th>Подготовка чертежей в минутах</th>
                <th>Коэффициент на администрирвание в %</th>
            </tr>
            
            <tr>
                <td><input v-model.number="documents" type="number"></td>
                <td><input v-model.number="adminCoef" type="number"></td>
            </tr>
           
            </tbody>
            </table>

                    <table>
            <tbody>
 
            <tr style="border: solid 2px orange">
                <th>Сборка</th>
                <th>Тестирование</th>
                <th>Администрирвание</th>
                <th>Итого</th>
            </tr>
            <tr>
                <td>{{finalResult}}</td>
                <td>{{cabtimetype[8].summ}}</td>
                <td>{{Math.round(+finalResult*+adminCoef/100 + +documents)}}</td>
                <td>{{+finalResult + Math.round(+finalResult*+adminCoef/100 + +documents)}}</td>
            </tr>
            </tbody>
            </table>
            
                    <!-- <div class="administration">
            <h3>Подготовка чертежей в минутах</h3><input type="number">
        </div>
         <div class="administration">
            <h3>Коэффициент на администрирвание в %</h3><input type="number">
        </div> -->
        </section>
        <br>
        <button v-if="cabinet" @click="postCabTime">SEND</button>
        <br>
        <br>
</template>

<script>
import conditionalRender from "@/components/conditionalRender.vue";
import chooseWoNumber from '@/components/chooseWoNumber.vue';
import chooseProjectNumber from "@/components/chooseProjectNumber.vue";
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import {
    reactive,
    toRefs,
    computed,
    nextTick,
    onMounted,
} from 'vue'
export default {
    components: {
    // //     chooseWoNumber,
    // //     conditionalRender,
    chooseProjectNumber,
    },
    setup() {
        const store = useStore()
        const route = useRoute()
        const cabtimeVal = reactive({})
        const state = reactive({
            adminCoef:"12",
            documents:"240",
            type: null,
            tt: null,
            fetchProject: null,
            projectInformation: null,
            projectData: null,
            cabinet: '',
            cabtimetype: null,
        })
        const setState = async () => {
            await store.dispatch('GET_template')
            state.tt = store.state.template.CabTimeV2;
            state.cabtimetype = store.state.template.CabTimeGroup;
        };
        setState()
        const inputData = ($event, key, val) => {
          
            let arr, coef;
            switch (key) {
                case '1.3':
                    arr = ['2.3', '2.4']
                    coef = 1
                    break;
                case '1.4':
                    arr = ['2.1', '2.2']
                    coef = 1
                    break;
                case '1.5':
                    arr = ['2.5', '2.6']
                    coef = 1
                    break;
                case '3.3':
                    arr = ['3.4']
                    coef = 1
                    break;
                case '4.4':
                    arr = ['4.5', '4.6']
                    coef = 1
                    break;
                case '4.8':
                    arr = ['4.9', '4.10']
                    coef = 2
                    break;
                case '5.1':
                    arr = ['5.2', '5.3']
                    coef = 2
                    break;
                case '5.4':
                    arr = ['5.5', '5.6']
                    coef = 2
                    break;
                case '5.9':
                    arr = ['5.10', '5.11']
                    coef = 2
                    break;
                default:
                    break;
            }
            state.tt.map(e => {
                if (arr) {
                    arr.forEach(el => {
                        if (e._id === el) {
                            e[val] = $event.target.value * coef
                            e.result = Math.round(e.value * e._const)
                        }
                    });
                }
                if (e._id === key) {
                    e[val] = $event.target.value
                    e.result = Math.round(e.value * e._const)
                }

            })
            state.cabtimetype.map(e => {
                return e.summ = state.tt.filter(f => f._type === e.name).reduce((acc, m) => {
                    return m.result ? acc += +m.result : acc
                }, 0)
            })
        }
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        // const summByType = computed(() => state.tt ? state.tt.push(store.state.template.CabTime.reduce((acc, el) => acc.add(el._type), new Set())) : 0)
        //  t =>  state.tt&&state.tt.reduce((acc,f) => f._type === t&&(acc +=f.result),0);
        const result = (a, b) => Math.ceil(a * b)
        const getType = computed(() => store.state.template && store.state.template.CabTime.reduce((acc, el) => acc.add(el._type), new Set()))
        const finalResult = computed(() => state.cabtimetype ? state.cabtimetype.reduce((acc,e) => {
            if (e.name === 'Тестирование и Поверка') {
                return acc
            } else{

                return acc += e.summ
            }
            } ,0):0)
        const groupBy = t => {
            if (store.state.template) {
                state.tt = store.state.template.CabTimeV2
                return state.tt.filter(g => g._type === t)
            }
        }

        const fetchProjectList = async () => {
            if (!state.projectData) {
                // debugger
                state.fetchProject = await (
                    await fetch(`/api/projects?status=open`)
                ).json();
                state.projectData = state.fetchProject.map((el) => el.id);
                // this.projectData = this.fetchProject.map(el => el.id);
            }
        }
        fetchProjectList()
        const chooseCabinet = (e) => {
            state.cabinet = e.split('   ')[0];
            store.commit("SETcabinetInfo", e);
            //   this.woState = true;
        }
        const choose = ($event) => {
            if (!$event) {
                state.projectInformation = false;
                return;
            }
            state.projectInformation = state.fetchProject.filter(
                (e) => e.id === $event
            )[0];
            //   console.log(this.projectInformation, "this.projectInformation");
            store.commit("SETprojectInfo", state.projectInformation);
        }

        const postCabTime = async () => {
            const cabTime = {
                "id": `cabtime__${Date.now()}`,
                "info": {
                    Проект: store.state.projectInfo['project number'],
                    Шкаф: store.state.projectInfo['cab name'],
                    wo: store.state.projectInfo.wo.toString(),
                },
                "type": "cabtime",
                "body": state.tt
            }
            await fetch('/api/POST_error', {
                method: 'POST', // или 'PUT'
                body: JSON.stringify({
                    ...cabTime
                }),
            })
            // console.log(route.params.cabtimeId);
        }
        const addNewRow = (e) => {
            const ff = state.tt.filter(g => g._type === e)
            const id = ff[ff.length - 1]._id.split('.')
            const dd = [id[0], +id[1] + 1].join('.')

            state.tt.push({
                new: true,
                "_id": dd,
                "name": "",
                "_const": "",
                "_type": e,
                "_field": "",
                "value": ""
            }, )
            console.log(e)
        };

        return {
            addNewRow,
            getType,
            groupBy,
            postCabTime,
            fetchProjectList,
            result,
            inputData,
            choose, // filterByGroup,
            cabtimeVal,
            chooseCabinet,
            finalResult,
            // summByType,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="css" scoped>
.administration{
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 1fr 1fr;
}
.add__row{
    border: 1px solid orange;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    cursor: pointer;
    margin-top: 5px;
    font-size: 30px;
    line-height: 1;
}
.add__row:hover{
    color: white;
    background-color: orange;
}
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