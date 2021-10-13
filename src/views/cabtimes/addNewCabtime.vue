<template>
  <h2>Расчёт нового CabTime</h2>
  <div v-if="!projectInfoState?.wo">
    <choose-project-number
      :data-to-render="state.projectData"
      @input-project-event="fetchProjectList"
      @choose-project-number="choose"
    />
    <div v-if="state.projectInformation">
      <br />
      <choose-project-number
        :data-to-render="
          state.projectInformation.cabinets.map(
            (e) => e.wo + '   ' + e['cab name']
          )
        "
        @choose-project-number="chooseCabinet"
      />
    </div>
  </div>
  <section v-else>
    <h3>
      Номер проекта {{ projectInfoState['project number'] }}
      <span style="cursor: pointer" @click="clearstate">&#10060;</span>
    </h3>
    <h3>Номер WO {{ projectInfoState['wo'] }}</h3>

    <div v-for="(t, i) in state.ctv3.groupByType" :key="i">
      <table>
        <colgroup>
          <col span="1" style="width: 5%" />
          <col span="1" style="width: 70%" />
          <col span="1" style="width: 10%" />
          <col span="1" style="width: 10%" />
          <col span="1" style="width: 5%" />
        </colgroup>
        <tbody>
          <tr style="border: solid 2px orange">
            <th>№</th>
            <th>{{ t.type }}</th>
            <th>Кол-во</th>
            <th>Const</th>
            <th>{{ state.ctv3.groupByType[i].total }}</th>
          </tr>
          <tr v-for="(value, index) in groupBy(t.type)" :key="index">
            <td>{{ value._id }}</td>
            <td class="cabtime__name">
              <div class="textarea" v-if="value.new"><textarea
                
                rows="1"
                @input="calculateLogic($event, value._id, 'name')"
                :value="value.name"
              ></textarea> <div class="close" @click="deleteRow(value._id)">&#10060;</div>
                </div>
              <p v-else>{{ value.name }}</p>
            </td>
            <td>
              <input
                class="cabtime__input"
                min="0"
                type="number"
                :value="value.value"
                @input="calculateLogic($event, value._id, 'value')"
              />
            </td>
            <td>
              <input
                v-if="value.new"
                class="cabtime__input"
                min="0"
                type="number"
                :value="value._const"
                @input="calculateLogic($event, value._id, '_const')"
              />
              <p v-else>{{ value._const }}</p>
            </td>
            <td>{{ value.result }}</td>
          </tr>
          <div class="add__row" @click="addNewRow(t.type)">+</div>
        </tbody>
      </table>
    </div>
    <table>
      <colgroup>
        <col span="1" style="width: 50%" />
        <col span="1" style="width: 50%" />
      </colgroup>
      <tbody>
        <tr style="border: solid 2px orange">
          <th>Подготовка чертежей в минутах</th>
          <th>Коэффициент на администрирвание в %</th>
        </tr>
        <tr>
          <td>
            <input
              v-model.number="state.ctv3.control.documents"
              class="cabtime__input"
              min="0"
              type="number"
            />
          </td>
          <td>
            <input
              v-model.number="state.ctv3.control.adminCoef"
              class="cabtime__input"
              min="0"
              type="number"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <h3>Итоговый результат в часах</h3>
    <table>
      <colgroup>
        <col span="1" style="width: 25%" />
        <col span="1" style="width: 25%" />
        <col span="1" style="width: 25%" />
        <col span="1" style="width: 25%" />
      </colgroup>
      <tbody>
        <tr style="border: solid 2px orange">
          <th>Сборка</th>
          <th>Тестирование + Поверка</th>
          <th>Администрирвание</th>
          <th>Сборка + Админ</th>
        </tr>
        <tr>
          <td v-for="(val, index) in cabtimeResult" :key="index">{{ val }}</td>
        </tr>
      </tbody>
    </table>
  </section>
  <br />
  <button v-if="projectInfoState?.wo" @click="postCabTime">SEND</button>
  <br />
  <br />
</template>

<script setup>
import conditionalRender from '@/components/conditionalRender.vue'
import chooseWoNumber from '@/components/chooseWoNumber.vue'
import chooseProjectNumber from '@/components/chooseProjectNumber.vue'
import { useStore } from 'vuex'
import { onBeforeRouteUpdate, useRouter } from 'vue-router'
import { reactive, toRefs, computed, nextTick, onMounted } from 'vue'

const store = useStore()
const router = useRouter()
router.afterEach((to, from) => {
  if (from.fullPath === '/cabtimes') {
    console.log(from, 'frooooom')
    store.commit('SETcurrentProject', null)
  }
})
const state = reactive({
  adminCoef: '12',
  documents: '240',
  type: null,
  cabtimeCopy: null,
  fetchProject: null,
  projectInformation: null,
  projectData: null,
  cabinet: '',
  cabtimetype: null,
  ctg: null,
  ctv3: null,
})
// DEEP COPY OBJECT
//    const deepCopy = JSON.parse(JSON.stringify(store.state.template.CabTimeV3))
state.ctv3 = JSON.parse(JSON.stringify(store.state.template.CabTimeV3))
const projectInfoState = computed(() => store.state.projectInfo)

const calculateLogic = ($event, key, val) => {
  let arr, coef
  switch (key) {
    case '1.3':
      arr = ['2.3', '2.4']
      coef = 1
      break
    case '1.4':
      arr = ['2.1', '2.2']
      coef = 1
      break
    case '1.5':
      arr = ['2.5', '2.6']
      coef = 1
      break
    case '4.3':
      arr = ['4.4']
      coef = 1
      break
    case '5.4':
      arr = ['5.5', '6.1']
      coef = 1
      break
    case '5.7':
      arr = ['5.8', '6.2']
      coef = 2
      break
    case '7.1':
      arr = ['7.2', '6.3']
      coef = 2
      break
    case '7.3':
      arr = ['7.4', '6.4']
      coef = 2
      break
    case '7.6':
      arr = ['7.8', '6.5']
      coef = 2
      break
    default:
      break
  }
  state.ctv3.body.map((e) => {
    arr &&
      arr.forEach((el) => {
        if (e._id === el) {
          e[val] = $event.target.value * coef
          e.result = Math.round(e.value * e._const)
        }
      })
    if (e._id === key) {
      e[val] = $event.target.value
      e.result = Math.round(e.value * e._const)
    }
  })
  state.ctv3.groupByType.map((e) => {
    return (e.total = state.ctv3.body
      .filter((f) => f._type === e.type)
      .reduce((acc, m) => {
        return m.result ? (acc += +m.result) : acc
      }, 0))
  })
}
// eslint-disable-next-line vue/no-side-effects-in-computed-properties
// const summByType = computed(() => state.ctv3.body ? state.ctv3.body.push(store.state.template.CabTime.reduce((acc, el) => acc.add(el._type), new Set())) : 0)
//  t =>  state.ctv3.body&&state.ctv3.body.reduce((acc,f) => f._type === t&&(acc +=f.result),0);
// const result = (a, b) => Math.ceil(a * b)

// const CabTimeGroup = computed(()=> state.ctv3.groupByType)

// const getType = computed(() => store.state.template && store.state.template.CabTime.reduce((acc, el) => acc.add(el._type), new Set()))
const finalResult = computed(() =>
  state.ctv3.groupByType.reduce(
    (acc, e) => (e.type === 'Тестирование и Поверка' ? acc : (acc += e.total)),
    0
  )
)
const cabtimeResult = computed(() => {
  return {
    assemble: Math.round(finalResult.value / 60),
    test: Math.round(
      state.ctv3.groupByType.find((e) => e.type === 'Тестирование и Поверка')
        .total / 60
    ),
    admin: Math.round(
      Math.round(
        (+finalResult.value * +state.adminCoef) / 100 + +state.documents
      ) / 60
    ),
    final: Math.round(
      (+finalResult.value +
        Math.round(
          (+finalResult.value * +state.adminCoef) / 100 + +state.documents
        )) /
        60
    ),
  }
})
const groupBy = (t) => state.ctv3.body.filter((g) => g._type === t)

const fetchProjectList = async () => {
  if (!state.projectData) {
    // debugger
    state.fetchProject = await (await fetch(`/api/projects?status=open`)).json()
    state.projectData = state.fetchProject.map((el) => el.id)
    // this.projectData = this.fetchProject.map(el => el.id);
  }
}
fetchProjectList()
const chooseCabinet = (e) => {
  // state.cabinet = e.split('   ')[0];
  store.commit('SETcabinetInfo', e)
  //   this.woState = true;
}
const choose = ($event) => {
  if (!$event) {
    state.projectInformation = false
    return
  }
  state.projectInformation = state.fetchProject.filter(
    (e) => e.id === $event
  )[0]
  //   console.log(this.projectInformation, "this.projectInformation");
  store.commit('SETprojectInfo', state.projectInformation)
}

const postCabTime = async () => {
  const cabTime = {
    id: `cabtime__${projectInfoState.value.wo}`,
    info: {
      Проект: projectInfoState.value['project number'],
      Шкаф: projectInfoState.value['cab name'],
      wo: projectInfoState.value.wo.toString(),
    },
    type: 'cabtime',
    ...state.ctv3,
    groupByType: state.ctv3.groupByType.filter((e) => e.total),
    body: state.ctv3.body.filter((e) => e.value),
    result: cabtimeResult.value,
    // adminCoef: state.adminCoef,
    // documents: state.documents,
    // cabtimeResult: cabtimeResult.value,
    // body: {
    //     ...state.ctv3.body.filter(e => e.value),
    // }
  }
  await fetch('/api/POST_error', {
    method: 'POST', // или 'PUT'
    body: JSON.stringify({
      ...cabTime,
    }),
  })
  // state.ctv3 = JSON.parse(JSON.stringify(store.state.template.CabTimeV3))
  router.back()
  // console.log(route.params.cabtimeId);
}
const addNewRow = (e) => {
  //filter by type
  const ff = state.ctv3.body.filter( g => g._type === e)
  //take last and create array by dot
  const id = ff[ff.length - 1]._id.split('.')
  // increese the last element and joy
  const dd = [id[0], +id[1] + 1].join('.')

  state.ctv3.body.push({
    new: true,
    _id: dd,
    name: '',
    _const: '',
    _type: e,
    _field: '',
    value: '',
  })
  // console.log(e)
}
const deleteRow = (id) =>{
  const currentArrow = state.ctv3.body.find(e => e._id === id )
  const index = state.ctv3.body.indexOf(currentArrow)
  console.log(index);
  state.ctv3.body.splice(index, 1)
}
const clearstate = () => {
  store.commit('SETcurrentProject', {})
  state.projectInformation = null
  state.ctv3 = JSON.parse(JSON.stringify(store.state.template.CabTimeV3))
}

//         return {
//             CabTimeGroup,
//             projectInfoState,
//             clearstate,
//             cabtimeResult,
//             addNewRow,
//             // getType,
//             groupBy,
//             postCabTime,
//             fetchProjectList,
//             // result,
//             calculateLogic,
//             choose, // filterByGroup,
//             cabtimeVal,
//             chooseCabinet,
//             finalResult,
//             // summByType,
//             ...toRefs(state)
//         }
//     }
// }
</script>

<style lang="css" scoped>
.administration {
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 1fr 1fr;
}
.add__row {
  border: 1px solid orange;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  margin-top: 5px;
  font-size: 30px;
  line-height: 1;
}
.add__row:hover {
  color: white;
  background-color: orange;
}
.cabtime__name {
  text-align: start;
}
.cabtime__input {
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
.textarea{
  display: grid;
  grid-template-columns: 1fr 24px;
  grid-auto-flow: column;
}
.close{
  cursor: pointer;
  place-self: center;
}
</style>
