<template>
  <div class="multiple" v-if="multiplePermission">
    <fieldset>
      <legend>Выбрать WO</legend>

      <input type="radio" id="one" :value="true" v-model="multipleCheck" />
      <label for="one">Один</label>
      <input type="radio" id="two" :value="false" v-model="multipleCheck" />
      <label for="two">Hесколько</label>
    </fieldset>
  </div>
  <input
    class="wo__filter"
    v-model="wo"
    placeholder="Введите номер WO или название шкафа"
  />
  <table style="width: 100%">
    <!-- <colgroup>
      <col style="width: 20%" />
      <col style="width: 80%" />
    </colgroup> -->
    <tr style="border: solid 2px orange">
      <th>WO</th>
      <th>Наименование</th>

      <th v-if="!multipleCheck">
        Выбрать всё<input @click="checkAll" type="checkbox" />
      </th>
      <th v-else>Выбрать WO</th>
    </tr>
    <tr v-for="(value, key, index) in filterWO" :key="index">
      <td>{{ value.wo }}</td>
      <td class="tg-0lax">{{ value["cab name"] }}</td>
      <td class="tg-0lax">
        <input
          v-if="!multipleCheck"
          :ref="setItemRef"
          type="checkbox"
          :value="value"
          v-model="checkedCabinetsNames"
        />
        <input
          v-else
          type="radio"
          :id="index"
          :value="value"
          v-model="checkedCabinetsNames"
        />
        <!-- <button>Выбрать</button> -->
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  emits: ["checkedWo"],
  data() {
    return {
      data: null,
      wo: "",
      multipleCheck: false,
      checkbox: [],
      checkedCabinetsNames: [],
      checkBoxAll: null,
      picked: "",
    };
  },
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
  watch: {
    checkedCabinetsNames() {
      this.$emit("checkedWo", this.checkedCabinetsNames);
    },
    multipleCheck() {
      this.checkedCabinetsNames = [];
      this.checkBoxAll = false;
    },
  },
  computed: {
    filterWO() {
      if (this.wo) {
        return Object.values(this.cabinetList).filter(
          (el) =>
            (el.wo && el.wo.includes(this.wo)) ||
            (el["cab name"] &&
              el["cab name"].toLowerCase().includes(this.wo.toLowerCase()))
        );
      } else {
        return this.cabinetList;
      }
    },
  },
  methods: {
    multipleChange() {
      this.multipleCheck = !this.multipleCheck;
      this.checkedCabinetsNames = [];
      this.checkBoxAll = false;
    },
    checkAll() {
      this.checkBoxAll = !this.checkBoxAll;
      if (this.checkBoxAll) {
        this.checkbox.forEach((e) => (e.checked = true));
        this.checkedCabinetsNames = this.cabinetList;
      } else {
        this.checkbox.forEach((e) => (e.checked = false));
        this.checkedCabinetsNames = [];
      }
    },
    setItemRef(el) {
      !this.checkbox && this.checkbox.push(el);
    },
  },
};
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
