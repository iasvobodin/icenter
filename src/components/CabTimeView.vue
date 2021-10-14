<template>
  <section v-if="state.ctv3.groupByType">
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
          <tr class="head">
            <th>№</th>
            <th>{{ t.type }}</th>
            <th>Кол-во</th>
            <th>Const</th>
            <th>{{ state.ctv3.groupByType[i].total }}</th>
          </tr>
          <tr v-for="(value, index) in groupBy(t.type)" :key="index">
            <td>{{ value._id }}</td>
            <td class="cabtime__name">
              <div v-if="value.new && changeData" class="textarea">
                <textarea
                  rows="1"
                  :value="value.name"
                  @input="calculateLogic($event, value._id, 'name')"
                ></textarea>
                <div class="close" @click="deleteRow(value._id)">&#10060;</div>
              </div>
              <p v-else>{{ value.name }}</p>
            </td>
            <td>
              <input
                v-if="changeData"
                class="cabtime__input"
                min="0"
                type="number"
                :value="value.value"
                @input="calculateLogic($event, value._id, 'value')"
              />
              <p v-else>{{ value.value }}</p>
            </td>
            <td>
              <input
                v-if="value.new && changeData"
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
          <div v-if="changeData" class="add__row" @click="addNewRow(t.type)">
            +
          </div>
        </tbody>
      </table>
    </div>
    <table>
      <colgroup>
        <col span="1" style="width: 50%" />
        <col span="1" style="width: 50%" />
      </colgroup>
      <tbody>
        <tr class="head">
          <th>Подготовка чертежей в минутах</th>
          <th>Коэффициент на администрирвание в %</th>
        </tr>
        <tr>
          <td>
            <input
              v-if="changeData"
              v-model.number="state.ctv3.control.documents"
              class="cabtime__input"
              min="0"
              type="number"
            />
            <p v-else>{{ state.ctv3.control.documents }}</p>
          </td>
          <td>
            <input
              v-if="changeData"
              v-model.number="state.ctv3.control.adminCoef"
              class="cabtime__input"
              min="0"
              type="number"
            />
            <p v-else>{{ state.ctv3.control.adminCoef }}</p>
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
        <tr class="head">
          <th>Сборка</th>
          <th>Тестирование + Поверка</th>
          <th>Администрирвание</th>
          <th>Сборка + Админ</th>
        </tr>
        <tr>
          <td v-for="(val, index) in cabtimeResult" :key="index">
            {{ val ? val : 0 }}
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import conditionalRender from '@/components/conditionalRender.vue'
import chooseWoNumber from '@/components/chooseWoNumber.vue'
import chooseProjectNumber from '@/components/chooseProjectNumber.vue'
import { useStore } from 'vuex'
import { onBeforeRouteUpdate, useRouter } from 'vue-router'
import {
  reactive,
  toRefs,
  computed,
  nextTick,
  onMounted,
  watchEffect,
} from 'vue'

const store = useStore()
const router = useRouter()

// MAYBE I HAVE TO DELETE THIS
// router.afterEach((to, from) => {
//   if (from.fullPath === '/cabtimes') {
//     store.commit('SETcurrentProject', null)
//   }
// })

// eslint-disable-next-line no-undef
const props = defineProps({
  inputData: {
    type: Object,
    required: true,
  },
  changeData: {
    type: Boolean,
    default: () => false,
  },
  templateData: {
    type: Object,
    required: true,
  },
})
// eslint-disable-next-line no-undef
const emit = defineEmits(['final'])
const state = reactive({
  // adminCoef: '12',
  // documents: '240',
  // type: null,
  // cabtimeCopy: null,
  // fetchProject: null,
  projectInformation: null,
  // projectData: null,
  // cabinet: '',
  // cabtimetype: null,
  // ctg: null,
  ctv3: null,
})
// DEEP COPY OBJECT
// const { inputData } = props
const { inputData, changeData } = toRefs(props)

const mergeObject = (templateObj, cabTimeObj) => {
  const bodyResult = [
    ...cabTimeObj.body,
    ...templateObj.body.filter(
      (e) => !cabTimeObj.body.some((s) => s._id === e._id)
    ),
  ]
  const groupByTypeResult = [
    ...cabTimeObj.groupByType,
    ...templateObj.groupByType.filter(
      (e) => !cabTimeObj.groupByType.some((s) => s.type === e.type)
    ),
  ].sort((a, b) => a._id - b._id)
  return { ...cabTimeObj, body: bodyResult, groupByType: groupByTypeResult }
}

watchEffect(() => {
  const copy = JSON.parse(JSON.stringify(store.state.template.CabTimeV3))
  props.changeData
    ? (state.ctv3 = mergeObject(copy, inputData.value))
    : //  (state.ctv3 = {
      //     // ...JSON.parse(JSON.stringify(store.state.template.CabTimeV3)),
      //     ...inputData.value,
      //     body: mergeObject(),
      //     groupByType: [
      //       ...copy.groupByType,
      //       ...inputData.value.groupByType,
      //     ],
      //   })
      (state.ctv3 = inputData.value)
})

// state.ctv3 = JSON.parse(JSON.stringify(store.state.template.CabTimeV3))
const inputDataComputed = computed(() =>
  props.changeData
    ? JSON.parse(JSON.stringify(store.state.template.CabTimeV3))
    : inputData.value
)
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

  const cabTimeToEmit = {
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
  }
  emit('final', cabTimeToEmit)
}

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
        ?.total / 60
    ),
    admin: Math.round(
      Math.round(
        (+finalResult.value * +state.ctv3.control.adminCoef) / 100 +
          +state.ctv3.control.documents
      ) / 60
    ),
    final: Math.round(
      (+finalResult.value +
        Math.round(
          (+finalResult.value * +state.ctv3.control.adminCoef) / 100 +
            +state.ctv3.control.documents
        )) /
        60
    ),
  }
})
const groupBy = (t) =>
  state.ctv3?.body
    .filter((g) => g._type === t)
    .sort((a, b) => a._id.split('.')[1] - b._id.split('.')[1])

// const fetchProjectList = async () => {
//   if (!state.projectData) {
//     // debugger
//     state.fetchProject = await (await fetch(`/api/projects?status=open`)).json()
//     state.projectData = state.fetchProject.map((el) => el.id)
//     // this.projectData = this.fetchProject.map(el => el.id);
//   }
// }
// fetchProjectList()
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
    body: { ...state.ctv3.body.filter((e) => e.value) },
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
  const ff = state.ctv3.body.filter((g) => g._type === e)
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
const clearstate = () => {
  store.commit('SETcurrentProject', {})
  state.projectInformation = null
  state.ctv3 = JSON.parse(JSON.stringify(store.state.template.CabTimeV3))
}
const deleteRow = (id) => {
  const currentArrow = state.ctv3.body.find((e) => e._id === id)
  const index = state.ctv3.body.indexOf(currentArrow)
  console.log(index)
  state.ctv3.body.splice(index, 1)
}
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
  margin: 6px;
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
  /* overflow: hidden; */
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  padding: 2vw;
  width: min(95vw, 800px);
  /* border-collapse: separate;
        border-spacing: 0; */
}
th{

}
td,
th {
  box-shadow: rgba(0, 0, 0, 0.15) 2.4px 2.4px 3.2px;
  box-shadow: rgba(0, 0, 0, 0.18) 0px 2px 4px;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 1px 0px;
  /* border: 1px solid #999; */
  
  padding: 0.5rem;
  font-size: 12px;
}
tbody tr:nth-child(odd) {
  /* box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px; */
  background: #ececec
}
tbody tr:hover {
  /* background: rgba(255, 166, 0, 0.1); */
  border-radius: 3px;
  box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
  box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;
}
.textarea {
  display: grid;
  grid-template-columns: 1fr 24px;
  grid-auto-flow: column;
}
.close {
  cursor: pointer;
  place-self: center;
}
    /* table tr th:first-child, table tr th:last-child{
    border-top:solid 1px      #bbb;} */
.head{
  border-bottom: solid 1px orange;
  background: white;
  /* box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
  box-shadow: rgba(0, 0, 0, 0.45) 0px 25px 20px -20px; */
  border-radius: 3px;
  height: 40px;
    position: sticky;
    top: 50px;
}
</style>
