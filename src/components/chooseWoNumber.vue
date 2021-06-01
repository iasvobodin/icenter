<template>
  <div v-if="multiplePermission" class="multiple">
    <fieldset>
      <legend>Выбрать WO</legend>
      <input id="one" v-model="multipleCheck" type="radio" :value="true" />
      <label for="one">Один</label>
      <input id="two" v-model="multipleCheck" type="radio" :value="false" />
      <label for="two">Hесколько</label>
    </fieldset>
  </div>
  <input
    v-model="wo"
    class="wo__filter"
    placeholder="Введите номер WO или название шкафа"
  />
  <table style="width: 100%">
    <tr style="border: solid 2px orange">
      <th>WO</th>
      <th>Наименование</th>
      <th v-if="!multipleCheck">
        Выбрать всё<input type="checkbox" @click="checkAll" />
      </th>
      <th v-else>Выбрать WO</th>
    </tr>
    <tr v-for="(value, key, index) in filterWO" :key="index">
      <td>{{ value.wo }}</td>
      <td class="tg-0lax">{{ value['cab name'] }}</td>
      <td class="tg-0lax">
        <input
          v-if="!multipleCheck"
          :ref="setItemRef"
          v-model="checkedCabinetsNames"
          type="checkbox"
          :value="value"
        />
        <input
          v-else
          :id="index"
          v-model="checkedCabinetsNames"
          type="radio"
          :value="value"
        />
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  props: {
    multiplePermission: {
      type: Boolean,
      default: () => false,
    },
    cabinetList: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['checkedWo'],
  data() {
    return {
      data: null,
      wo: '',
      multipleCheck: false,
      checkbox: [],
      checkedCabinetsNames: [],
      checkBoxAll: null,
      picked: '',
    }
  },
  computed: {
    filterWO() {
      if (this.wo) {
        return Object.values(this.cabinetList).filter(
          (el) =>
            (el.wo && el.wo.includes(this.wo)) ||
            (el['cab name'] &&
              el['cab name'].toLowerCase().includes(this.wo.toLowerCase())),
        )
      } else {
        return this.cabinetList
      }
    },
  },
  watch: {
    checkedCabinetsNames() {
      this.$emit('checkedWo', this.checkedCabinetsNames)
    },
    wo(){
        this.checkedCabinetsNames = []
        // this.checkBoxAll = false
    },
    multipleCheck() {
      this.checkedCabinetsNames = []
      this.checkBoxAll = false
    },
  },
  methods: {
    multipleChange() {
      this.multipleCheck = !this.multipleCheck
      this.checkedCabinetsNames = []
      this.checkBoxAll = false
    },
    checkAll() {
      this.checkBoxAll = !this.checkBoxAll
      if (this.checkBoxAll) {
        this.checkbox.forEach((e) => (e.checked = true))
        this.checkedCabinetsNames = this.filterWO
      } else {
        this.checkbox.forEach((e) => (e.checked = false))
        this.checkedCabinetsNames = []
      }
    },
    setItemRef(el) {
      !this.checkbox && this.checkbox.push(el)
    },
  },
}
</script>

<style lang="css" scoped>
/* input {
  height: 30px;
  font-size: 16px;
  text-align: center;
  width: 100%;
} */
.multiple {
  margin-top: 2vh;
}
button,
input {
  position: relative;
  padding: 2px 20px;
  margin: 5px 5px;
  border: 1px solid orange;
  text-align: center;
  line-height: 20px;
  border-radius: 5px;
  transition: all 0.2s;
}
table {
  margin-top: 2vh;
  border-collapse: collapse;
  border-radius: 5px;
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
  background: yellow;
}
.wo__filter {
  width: 99%;
  height: 30px;
  margin: auto;
  margin-top: 2vh;
  margin-bottom: 2vh;
}
</style>
