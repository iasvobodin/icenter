<template>
  <div class="project__info">
    <h2>Итоговая информация по добавляемому проекту</h2>
    <div
      v-for="(value, key, index) in project"
      :key="index"
      class="project__info__row"
    >
      <span>{{ key }}</span>

      <span v-if="!changeInfo" >{{ value }}</span>
      <input v-else v-model="message[key]" :placeholder="value" />
    </div>
    <div v-if="cabinets.length === 0">
      <h4>Шкафные линии не выбраны</h4>
    </div>
    <div v-else>
      <h4>Выбранные шкафы</h4>
      <div
        v-for="(value, key, index) in cabinets"
        :key="index"
        class="project__info__row"
      >
        <span v-if="value.wo"> WO: {{ value.wo }}</span>
        <span
          v-else
          style="padding: 5px; color: white; background-color: red; font-size:10px;"
        >
          Номер WO должен быть заполнен
        </span>
        <span>Name :{{ value["cab name"] }}</span>
      </div>
    </div>
  </div>
  <button @click="changeInfo = !changeInfo">Редактировать</button>
  <button @click="postProject">Отправить</button>
</template>

<script>
export default {
  data() {
    return {
        message: {},
        changeInfo: false,
      fetchTemplate: null,
    };
  },
  props: {
    projectNumber: {
      type: String,
      default: () => ""
    },
    project: {
      type: Object,
      default: () => {}
    },
    cabinets: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    async postProject() {
      const cab = this.cabinets.map(el => {
        return {
          wo: el.wo,
          cabName: el["cab name"],
          cabTime: {},
          dimensions: "",
          documentation: "",
          weight: "",
          hardwareEngineer: ""
        };
      });
      await fetch("/api/POST_project", {
        method: "POST", // или 'PUT'
        body: JSON.stringify({
          id: this.projectNumber,
          status: "open",
          info: this.message,
          cabinets: cab
        })
      });
    }
  },
  async mounted() {
      this.message = this.project
    // try {
    //   this.fetchTemplate = await (
    //     await fetch("/api/templates/project/projectTemplate")
    //   ).json();
    // } catch (error) {
    //   console.log(error);
    // }
  }
};
</script>

<style lang="css" scoped>
.project__info {
  border: solid 1px black;
}
.project__info__row {
  border-bottom: solid 1px black;
  background: rgba(214, 214, 214, 0.459);
  padding: 5px;
  display: grid;
  grid-template-columns: 1fr 2fr;
}
.project__info__row > span {
  justify-self: stretch;
  align-self: center;
  /* place-self: start; */
  text-align: start;
}
</style>
