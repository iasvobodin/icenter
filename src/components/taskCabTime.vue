<template>
  <div>
    <table>
      <colgroup>
        <col span="1" class="collgroup1" />
        <col span="1" class="collgroup2" />
        <col v-if="statusMark" span="1" class="collgroup3" />
        <col v-if="statusMark" span="1" class="collgroup4" />
        <col v-if="!statusMark" span="1" class="collgroup5" />
      </colgroup>
      <thead class="head">
        <tr>
          <th rowspan="2">№</th>
          <th rowspan="2">Задача</th>
          <th v-if="statusMark" colspan="2">Выполнено</th>
          <th v-if="!statusMark" rowspan="1">Результат</th>
        </tr>
        <tr v-if="statusMark">
          <th class="vertical">Частично</th>
          <th class="vertical">Полностью</th>
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
          <td>{{ value._id }}</td>
          <td class="desc">{{ value.name }}</td>
          <td v-if="statusMark">
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
          <td v-if="statusMark">
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
          <td v-if="!statusMark">
            <input
              class="cabtime__input"
              type="number"
              :value="+value.result"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { toRefs } from '@vue/reactivity'
import { watchEffect } from '@vue/runtime-core'

// eslint-disable-next-line no-undef
const props = defineProps({
  inputData: {
    type: Object,
    required: true,
  },
  //   changeData: {
  //     type: Boolean,
  //     default: () => false,
  //   },
  statusMark: {
    type: Boolean,
    default: () => true,
  },
  //   templateData: {
  //     type: Object,
  //     required: true,
  //   },
})
const emit = defineEmits({
  cabtimeWithStatus: null,
})
const { inputData, changeData, templateData, statusMark } = toRefs(props)

inputData.value.body
  .sort((a, b) => a._id.split('.')[1] - b._id.split('.')[1])
  .sort((a, b) => a._id.split('.')[0] - b._id.split('.')[0])
watchEffect(()=>{
!statusMark.value &&
  inputData.value.body.sort((a, b) => {
    const x = a.status.toLowerCase()
    const y = b.status.toLowerCase()
    return x < y ? -1 : x > y ? 1 : 0
  })
})

const changeStatus = (ev, id, val) => {
  const item = inputData.value.body.find((e) => e._id === id)
  ev.target.checked ? (item.status = val) : (item.status = 'open')
  emit(
    'cabtimeWithStatus',
    inputData.value.body.filter((f) => f.status && f.status !== 'open')
  )
}
</script>

<style lang="css" scoped>
.cabtime__input {
  width: min(100%, 60px);
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

  padding: 3px;
  font-size: 12px;
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
  width: 10%;
}
.collgroup5 {
  width: 10%;
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
