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
                    <tr v-for="(value, key, index) in  groupBy(t)" :key="index">
                        <td>{{ value._id }}</td>
                        <td class="cabtime__name">{{ value.name }}</td>
                        <td class="tg-0lax"><input class="cabtime__input" type="number"
                                @input="inputData($event, value.name)"></td>
                        <td class="tg-0lax">{{ value._const }}</td>
                        <td class="tg-0lax">
                            <div v-show="cabtimeVal[value.name]">{{result(value._const,cabtimeVal[value.name]) }}</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
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
            type: null,
            tt: null,
            fetchProject: null,
            projectInformation: null,
            projectData: null,
            cabinet:'',
        })
        const inputData = ($event, key) => {
            !state.tt && (state.tt = store.state.template.CabTime)
            state.tt.map(e => {
                if(e.name === key) {
                e.value = $event.target.value
                e.result = $event.target.value * e._const
                console.log(e);
            }
            }
            )
        }
        const result = (a, b) => Math.ceil(a * b)
        const getType = computed(() => store.state.template && store.state.template.CabTime.reduce((acc, el) => acc.add(el._type), new Set()))
        const groupBy = t => {
            return store.state.template && store.state.template.CabTime.filter(g => g._type === t)
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
        return {
            getType,
            groupBy,
            postCabTime,
            fetchProjectList,
            result,
            inputData,
            choose, // filterByGroup,
            cabtimeVal,
            chooseCabinet,
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