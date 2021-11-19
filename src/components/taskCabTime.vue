<template>
  <div>
    <table>
      <colgroup>
        <!-- <col span="1" class="collgroup1" /> -->
        <col span="1" class="collgroup2" />
        <col v-if="statusMark" span="1" class="collgroup3" />
        <col v-if="statusMark" span="1" class="collgroup4" />
        <col v-if="!statusMark" span="1" class="collgroup5" />
        <col v-if="!statusMark" span="1" class="collgroup5" />
      </colgroup>
      <thead class="head">
        <tr>
          <!-- <th rowspan="2">№</th> -->
          <th rowspan="2">Задача</th>
          <th style="text-align: center" v-if="statusMark" colspan="2">
            Выполнено
          </th>
          <th class="vertical" v-if="!statusMark" rowspan="1">CabTime (мин)</th>
          <th
            style="text-align: center"
            class="vertical"
            v-if="!statusMark"
            rowspan="1"
          >
            Авто-расчёт (мин)
          </th>
        </tr>
        <tr v-if="statusMark">
          <th style="text-align: center" class="vertical">Частично</th>
          <th style="text-align: center" class="vertical">Полностью</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(value, index) in copyInputData"
          :key="index"
          :class="{
            partially: value.status === 'partially',
            done: value.status === 'done',
          }"
        >
          <!-- <td>{{ value._id }}</td> -->
          <td class="desc">{{ value._id }}{{ value.name }}</td>
          <td style="text-align: center" v-if="statusMark">
            <input
              @input="changeStatus($event, value._id, 'partially')"
              :checked="value.status === 'partially'"
              type="checkbox"
              name=""
              id=""
            />
            <!-- <label>
              <input  :id="`${value._id}thr`" type="radio" :name="`${index}o`" @input="changeStatus($event, value._id, 'partially')" />
            </label> -->
          </td>
          <td style="text-align: center" v-if="statusMark">
            <input
              @input="changeStatus($event, value._id, 'done')"
              :checked="value.status === 'done'"
              type="checkbox"
              name=""
              id=""
            />
            <!-- <label>
              <input :id="`${value._id}two`" type="radio" :name="`${index}o`" @input="changeStatus($event, value._id, 'done')" />
            </label> -->
          </td>
          <td style="text-align: center" v-if="!statusMark">
            {{ value.result }}
          </td>
          <td v-if="!statusMark">
            <input
            @input="changePartyalyyTime($event, value._id)"
              class="cabtime__input"
              type="number"
              :value="value.propTime"
            />
          </td>
        </tr>
      </tbody>
    </table>
    {{ state.alertMessage ? state.alertMessage : '' }}
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, toRefs } from '@vue/reactivity'
import { PropType, watchEffect } from '@vue/runtime-core'
import { useStore } from 'vuex'
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
})
const emit = defineEmits({
  cabtimeWithStatus: null,
  proportTime: null,
})
const { inputData, statusMark } = toRefs(props)

const timeToCalc = computed(() => store.state.photosModule.passedTime)

const copyInputData = computed(() => [...inputData.value.body]
    .sort((a, b) => +a._id.split('.')[1] - +b._id.split('.')[1])
    .sort((a, b) => +a._id.split('.')[0] - +b._id.split('.')[0]))

watchEffect(() => {
  if (!statusMark.value) {
    const acc = {
      allSumm: 0,
      doneSumm: 0,
      partiallySumm: 0,
      partiallyTimeSumm: 0,
    }
    type Account = typeof acc

    const calcSumm = copyInputData.value.reduce((acc: Account, e) => {
      e.status === 'partially' && (acc.partiallySumm += e.result)
      e.status === 'done' && (acc.doneSumm += e.result)
      e.propTime && (acc.partiallyTimeSumm += e.propTime)
      acc.allSumm += e.result
      return acc
    }, acc)
    console.log(calcSumm)

    if (
      timeToCalc.value > calcSumm.doneSumm &&
      timeToCalc.value < calcSumm.allSumm
    ) {
      state.alertMessage = 'all ok'
    }

    if (timeToCalc.value < calcSumm.doneSumm) {
      state.alertMessage = 'to fast'
    }

    if (timeToCalc.value > calcSumm.allSumm) {
      state.alertMessage = 'to slow'
    }

    // console.log(copyInputData.value);
    copyInputData.value.forEach((e) => {
      e.propTime = Math.round((e.result / calcSumm.allSumm) * timeToCalc.value)
    })



    console.log(copyInputData.value)
    copyInputData.value.sort((a, b) => {
      const x = a.status.toLowerCase()
      const y = b.status.toLowerCase()
      return x < y ? -1 : x > y ? 1 : 0
    })
  }
})
const changePartyalyyTime = (ev: Event, id:string) => {
  if (!(ev.target instanceof HTMLInputElement)) return
 const item = copyInputData.value.find((e) => e._id === id)
  item&&(item.propTime = +ev.target.value)

      const partiallySumm = copyInputData.value.reduce(
      (acc: number, e) => (acc += e.propTime!),
      0
    )
    console.log(partiallySumm)
}
const changeStatus = (ev: Event, id: string, val: string) => {
  if (!(ev.target instanceof HTMLInputElement)) return
  // const input = ev.target as HTMLInputElement;

  const item = inputData.value.body.find((e) => e._id === id)
  ev.target.checked ? (item!.status = val) : (item!.status = 'open')
  emit(
    'cabtimeWithStatus',
    inputData.value.body.filter((f) => f.status && f.status !== 'open')
  )
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
