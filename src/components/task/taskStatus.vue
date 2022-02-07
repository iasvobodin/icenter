<template>
  <div>
    <div class="description">
      <h3>Выбор задач</h3>
      <p>Выберите задачи которые полностью или частично выполнены</p>
    </div>
    <table>
      <colgroup>
        <col span="1" class="collgroup2" />
        <col span="1" class="collgroup3" />
        <col span="1" class="collgroup4" />
      </colgroup>
      <thead class="head">
        <tr>
          <th rowspan="2">Задача</th>
          <th style="text-align: center" colspan="2">Выполнено</th>
        </tr>
        <tr>
          <th style="text-align: center" class="vertical">Частично</th>
          <th style="text-align: center" class="vertical">Полностью</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(value, index) in inputData.body"
          :key="index"
          :class="{
            partially: value.status === 'partially',
            done: value.status === 'done',
          }"
        >
          <td class="desc">{{ value.name }}</td>
          <td style="text-align: center">
            <input
              :checked="value.status === 'partially'"
              type="checkbox"
              @input="changeStatus($event, value._id, 'partially')"
            />
          </td>
          <td style="text-align: center">
            <input
              :checked="value.status === 'done'"
              type="checkbox"
              @input="changeStatus($event, value._id, 'done')"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <br />
    <br />
    <button @click="firstCaptureData">Далее</button>
    <button @click="resetStatus">Сбросить</button>
  </div>
  <div
    v-if="state.alertMessage && $store.state.cabtimeWithStatus.length > 0"
    class="message"
  >{{ state.alertMessage }}</div>
</template>

<script setup lang="ts">
import {
  computed,
  reactive,
  toRefs,
  readonly,
  Ref,
  ref,
  toRaw,
  isReactive,
  isRef,
  unref,
} from '@vue/reactivity'
import { PropType, watchEffect } from '@vue/runtime-core'
import { useStore } from 'vuex'
// import { useStore } from '@/store'
import { cabtimeType } from '@/types/cabtimeTypes'

const store = useStore()
// eslint-disable-next-line no-undef
const props = defineProps({
  inputData: {
    type: Object as PropType<cabtimeType>,
    required: true,
  },
  statusMark: {
    type: Boolean,
    default: () => true,
  },
})
const state = reactive({
  alertMessage: '',
  allSumm: 0,
  partiallySumm: 0,
  wellDone: true,
})
const emit = defineEmits({
  cabtimeWithStatus: null,
  proportTime: null,
})
const { statusMark, inputData } = toRefs(props)

inputData.value.body
  .sort((a, b) => +a._id.split('.')[1] - +b._id.split('.')[1])
  .sort((a, b) => +a._id.split('.')[0] - +b._id.split('.')[0])

const timeToCalc = computed(() => store.state.passedTime)
const firstCaptureData = () => {
  const rawData = toRaw(unref(inputData))
  const modArr = rawData.body.filter((f) => f.status && f.status !== 'open')

  const particalCalculate = (
    taskArray: cabtimeType['body'],
    spentTime: number,
    timeAll: number,
    timeDone: number
  ) => {
    taskArray.forEach((e) => {
      e.fitter = store.state.user.info.userDetails
      e.date = Date.now()
    })

    if (spentTime > timeDone && spentTime < timeAll) {
      console.log('ALL OK')

      state.alertMessage = 'Время на полностью закрытые задачи будет списано согласно CabTime, а на частично выполненные задачи, пропорционально.(ok)'
      const difTime = spentTime - timeDone
      const partiallyTime = timeAll - timeDone
      taskArray.forEach((e) => {
        if (e.status === 'done') {
          e.propTime = e.result
        }
        if (e.status === 'partially') {
          e.propTime = Math.round((e.result / partiallyTime) * difTime)
        }
      })
    }

    if (spentTime < timeDone) {
      state.alertMessage = 'Сумма минут на полностью закрытые задачи, превышает время работы, автоматический расчёт будет меньше чем по CadTime.(Быстро)'
      //CALCULATE ONLY DONE
      console.log('TO FAST')
      taskArray.forEach((e) => {
        if (e.status === 'done') {
          e.propTime = Math.round((e.result / timeDone) * spentTime)
        }
        if (e.status === 'partially') {
          e.propTime = 0
        }
      })
    }

    if (spentTime > timeAll) {
      state.alertMessage = 'Списываемое время, меньше чем сумма минут на полностью закрытые задачи, автоматический расчёт будет больше чем по CadTime.(Медленно)'
      console.log('TO SLOW')
      taskArray.forEach((e) => {
        e.propTime = Math.round((e.result / timeAll) * spentTime)
      })
    }
    return taskArray
  }

  state.allSumm = rawData.body.reduce((acc: number, e) => {
    if (e?.status && e.status !== 'open') {
      acc += e.result
    }
    return acc
  }, 0)
  console.log(state.allSumm, 'allSumm')

  const partiallySumm = rawData.body.reduce((acc: number, e) => {
    if (e?.status && e.status === 'partially') {
      acc += e.result
    }
    return acc
  }, 0)

  console.log(partiallySumm, 'partiallySumm')

  const doneSumm = rawData.body.reduce((acc: number, e) => {
    if (e?.status === 'done') {
      acc += e.result
    }
    return acc
  }, 0)

  console.log(doneSumm, 'doneSumm')
  // store.commit('SET_TASK_DONE_SUMM',doneSumm)

  console.log(
    particalCalculate(modArr, timeToCalc.value, state.allSumm, doneSumm),
    'TADA'
  )
  // if (timeToCalc.value > doneSumm && timeToCalc.value < state.allSumm) {
  //   state.alertMessage = 'all ok'
  //   //ALL OK
  //   timeToCalc.value - doneSumm
  // }

  // if (timeToCalc.value < doneSumm) {
  //   state.alertMessage = 'to fast'
  // }

  // if (timeToCalc.value > state.allSumm) {
  //   state.alertMessage = 'to slow'
  // }

  // rawData.body.forEach((e) => {
  //   e.propTime = Math.round((e.result / state.allSumm) * timeToCalc.value)
  // })

  // console.log(timeToCalc.value);

  //    rawData.sort((a, b) => {
  //   const x = a.status?.toLowerCase()
  //   const y = b.status?.toLowerCase()
  //   return x < y ? -1 : x > y ? 1 : 0
  // })
  store.commit(
    'setCabtimeWithStatus',
    particalCalculate(modArr, timeToCalc.value, state.allSumm, doneSumm)
    // rawData.body.filter((f) => f.status && f.status !== 'open')
  )
}
// watchEffect(() => {
//   if (!statusMark.value) {
//     const acc = {
//       allSumm: 0,
//       doneSumm: 0,
//       partiallySumm: 0,
//       partiallyTimeSumm: 0,
//     }
//     type Account = typeof acc

//     const calcSumm = copyInputData.value.reduce((acc: Account, e) => {
//       e.status === 'partially' && (acc.partiallySumm += e.result)
//       e.status === 'done' && (acc.doneSumm += e.result)
//       e.propTime && (acc.partiallyTimeSumm += e.propTime)
//       acc.allSumm += e.result
//       return acc
//     }, acc)
//     console.log(calcSumm)

//     if (
//       timeToCalc.value > calcSumm.doneSumm &&
//       timeToCalc.value < calcSumm.allSumm
//     ) {
//       state.alertMessage = 'all ok'
//     }

//     if (timeToCalc.value < calcSumm.doneSumm) {
//       state.alertMessage = 'to fast'
//     }

//     if (timeToCalc.value > calcSumm.allSumm) {
//       state.alertMessage = 'to slow'
//     }

//     // console.log(copyInputData.value);
//     copyInputData.value.forEach((e) => {
//       e.propTime = Math.round((e.result / calcSumm.allSumm) * timeToCalc.value)
//     })

//     console.log(copyInputData.value)
//     copyInputData.value.sort((a, b) => {
//       const x = a.status.toLowerCase()
//       const y = b.status.toLowerCase()
//       return x < y ? -1 : x > y ? 1 : 0
//     })
//   }
// })

const calculatePartiallySumm = () => {
  state.partiallySumm = inputData.value.body.reduce(
    (acc: number, e) => (acc += e.propTime!),
    0
  )
  // debugger
  const difTime = timeToCalc.value - state.partiallySumm

  // console.log(difTime, 'eee')
  if (difTime >= -10 && difTime <= 10) {
    state.wellDone = false
  } else state.wellDone = true
}

calculatePartiallySumm()
const changePartyalyyTime = (ev: Event, id: string) => {
  if (!(ev.target instanceof HTMLInputElement)) return
  const item = inputData.value.body.find((e) => e._id === id)
  item && (item.propTime = +ev.target.value)
  calculatePartiallySumm()
  // state.partiallySumm = inputData.value.body.reduce(
  //   (acc: number, e) => (acc += e.propTime!),
  //   0
  // )

  //   if (difTime < -10) {

  //   console.log(difTime, 'www')
  // }
}
function resetStatus() {
  inputData.value.body.forEach((e) => (e.status = 'open'))
}
const changeStatus = (ev: Event, id: string, val: string) => {
  if (!(ev.target instanceof HTMLInputElement)) return
  const item = inputData.value.body.find((e) => e._id === id)
  ev.target.checked ? (item!.status = val) : (item!.status = 'open')
}
</script>

<style lang="css" scoped>
.cabtime__input {
  width: min(100%, 70px);
}
thead tr th {
  white-space: pre-wrap;
  word-wrap: break-word;
}
table {
  margin: auto;
  margin-top: 2vh;
  border-collapse: collapse;
  border-radius: 5px;
  /* overflow: hidden; */
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  padding: 2vw;
  width: min(95vw, 800px);
}

td,
th {
  box-shadow: rgba(0, 0, 0, 0.15) 2.4px 2.4px 3.2px;
  box-shadow: rgba(0, 0, 0, 0.18) 0px 2px 4px;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px,
    rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 1px 0px;

  /* padding: 3px; */
  /* padding-right: 1ch; */
  /* text-align: start; */
  font-size: 12px;
}
td input {
  text-align: center;
}

tbody tr:nth-child(odd) {
  background: #ececec5d;
}
table tbody .partially {
  background: hsl(252deg 100% 95%);
}
table tbody .done {
  background: hsl(120deg 100% 95%);
}
tbody tr {
  margin-bottom: 10px;
  height: 40px;
}

.desc {
  text-align: start;
  padding-left: 1ch;
}
/* tbody tr:hover {
  border-radius: 3px;
  box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
  box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px,
    rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;
} */
.head {
  border-bottom: solid 1px orange;
  background: white;
  border-radius: 3px;
  height: 40px;
  position: sticky;
  top: 50px;
}
label {
  width: inherit;
  text-align: start;
  /* display: in; */
}
input[type="radio"] {
  margin: 0;
}

.collgroup1 {
  width: 5%;
}
.collgroup2 {
  width: 65%;
}
.collgroup3 {
  width: 10%;
}
.collgroup4 {
  width: 15%;
}
.collgroup5 {
  width: 15%;
}

@media only screen and (max-width: 600px) {
  .vertical {
    max-width: 40px;
    padding: 2px;
  }
  .collgroup2 {
    width: 55%;
  }
  .cabtime__input {
    text-align: center;
    width: 6ch;
  }
  tbody tr {
    height: 50px;
    margin-bottom: 10px;
  }
  /* .vertical {
    writing-mode: tb-rl;
    transform: rotate(-180deg);
    min-height: 110px;
  } */
}
.message {
  width: min(95vw, 800px);
  margin: auto;
  margin-top: 2vh;
  border: 1px solid orange;
  border-radius: 5px;
  padding: 10px;
}
</style>
