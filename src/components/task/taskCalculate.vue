<template>
  <div>
    <div class="description">
      <h3>Время выполнения {{ timeToCalc }}мин</h3>
      <p>
        Время по отмеченным задачам расчитывается автоматически, проверьте
        столбец результат, и внесите корректировки, если это необходимо. <br />
        При ручной корректировке время работы, должно соответсвоть расчётному!
      </p>
    </div>
    <table>
      <colgroup>
        <!-- <col span="1" class="collgroup1" /> -->
        <col span="1" class="collgroup2" />
        <col span="1" class="collgroup5" />
        <col span="1" class="collgroup5" />
      </colgroup>
      <thead class="head">
        <tr>
          <th rowspan="2">Задача</th>

          <th class="vertical" rowspan="1">CabTime (мин)</th>
          <th style="text-align: center" class="vertical" rowspan="1">
            Авто-расчёт (мин)
          </th>
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
            {{ value.result }}
          </td>
          <td>
            <input
              class="cabtime__input"
              type="number"
              :value="value.propTime"
              @input="changePartyalyyTime($event, value._id)"
            />
          </td>
        </tr>
      </tbody>
    </table>
    {{ state.alertMessage ? state.alertMessage : '' }}

    <table class="table__result">
      <thead class="head">
        <tr>
          <th>Время работы</th>
          <th>Расчётное время</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <h3>{{ timeToCalc }}</h3>
          </td>
          <td>
            <h3>{{ state.partiallySumm }}</h3>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- <p v-if="state.difTime">Разница между затраченным и расчетным временем не должна превышать 10 минут. <br> Будьте внимательны при внесении изменений!<br> Расхождение в {{state.difTime}}минут </p> <br> -->
    <button v-if="!state.wellDone">SAVE</button>
    <h3 v-else style="color: red">
      Время работы должно равнятся расчётному! +- 10минут
    </h3>
  </div>
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
})
const state = reactive({
  alertMessage: '',
  allSumm: 0,
  partiallySumm: 0,
  wellDone: true,
  difTime: 0,
})
const emit = defineEmits({
  cabtimeWithStatus: null,
  proportTime: null,
})
const { inputData } = toRefs(props)

const timeToCalc = computed(() => store.state.passedTime)

// const calculatePartiallySumm = () => {
//   state.partiallySumm = inputData.value.body.reduce(
//     (acc: number, e) => (acc += e.propTime!),
//     0
//   )
//   state.difTime = timeToCalc.value - state.partiallySumm

//   if (state.difTime >= -10 && state.difTime <= 10) {
//     state.wellDone = false
//   } else state.wellDone = true
// }

// calculatePartiallySumm()

watchEffect(() => {
  state.partiallySumm = inputData.value.body.reduce(
    (acc: number, e) => (acc += e.propTime!),
    0
  )
  state.difTime = timeToCalc.value - state.partiallySumm

  if (state.difTime >= -10 && state.difTime <= 10) {
    state.wellDone = false
  } else state.wellDone = true
})

// calculatePartiallySumm()

const changePartyalyyTime = (ev: Event, id: string) => {
  if (!(ev.target instanceof HTMLInputElement)) return
  const item = inputData.value.body.find((e) => e._id === id)
  item && (item.propTime = +ev.target.value)
  //   calculatePartiallySumm()
}
</script>

<style lang="css" scoped>
.description {
  width: min(95vw, 800px);
  margin: 5vh auto;
}
.table__result {
  margin-bottom: 4vh;
  margin-top: 4vh;
}
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
input[type='radio'] {
  margin: 0;
}
tbody tr {
  margin-bottom: 10px;
  height: 40px;
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

table tbody .partially {
  background: hsl(252deg 100% 95%);
}
table tbody .done {
  background: hsl(120deg 100% 95%);
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
</style>
