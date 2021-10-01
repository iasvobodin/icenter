<template>
    <section>
        <div v-for="(t,i) in $store.state.template.CabTimeGroup" :key="i">
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
                        <th>{{$store.state.template.CabTimeGroup[i].summ}}</th>
                    </tr>
                    <tr v-for="(value, index) in  groupBy(t.name)" :key="index">
                        <td>{{ value._id }}</td>
                        <td v-if="value.new" class="cabtime__name">
                            <textarea rows="1"></textarea>
                        </td>
                        <td v-else class="cabtime__name">{{ value.name }}</td>
                        <td><input class="cabtime__input" min="0" type="number" :value="value.value"
                                @input="calculateLogic($event, value._id, 'value')"></td>
                        <td v-if="value.new">
                            <input class="cabtime__input" min="0" type="number"
                                @input="calculateLogic($event, value._id, '_const')">
                        </td>
                        <td v-else>{{ value._const }}</td>
                        <td>{{tt&&value.result}}</td>
                    </tr>
                    <div class="add__row" @click="addNewRow(t.name)"> + </div>
                </tbody>
            </table>
        </div>
    </section>
</template>

<script setup>
import { useStore } from 'vuex';
import { onBeforeRouteUpdate, useRouter } from 'vue-router';
import {
    reactive,
    toRefs,
    computed,
    nextTick,
    onMounted,
} from 'vue'

const props = defineProps({
  CabtimeFromServer: String
})
 const store = useStore()
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
        const groupBy = t => {
            if (store.state.template) {
                state.tt = store.state.template?.CabTimeV2
                return state.tt.filter(g => g._type === t)
            }
        }
                const calculateLogic = ($event, key, val) => {
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
            CabTimeGroup.value.map(e => {
                return e.summ = state.tt.filter(f => f._type === e.name).reduce((acc, m) => {
                    return m.result ? acc += +m.result : acc
                }, 0)
            })
        }
</script>

<style lang="scss" scoped>

</style>