<template>
  <div>
    <div v-if="!projectList" class="project__holder">Загрузка данных</div>
    <table v-else>
      <thead>
        <tr>
          <th>Номер проекта</th>
          <!-- <th v-for="(value, key, index) in projectList[0].info" :key="index">{{key}}</th> -->
          <th
            v-for="(value, key, index) in projectList[0].extends"
            :key="index"
          >
            {{ key }}
          </th>
          <th>Шкафы</th>
          <th>Изменить</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(value, key, index) in projectList" :key="index">
          <td>{{ value.id }}</td>
          <!-- <td v-for="(val, key, index) in value.info" :key="index">{{val}}</td> -->
          <td v-for="(val, key, index) in value.extends" :key="index">
            {{ val }}
          </td>
          <td style="padding: 0px">
            <table style="width: 100%">
              <thead>
                <tr>
                  <th>WO</th>
                  <th>Cab Name</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(cabinet, key, index) in value.cabinets"
                  :key="index"
                >
                  <td v-for="(val, key, index) in cabinet" :key="index">
                    {{ val }}
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
          <td><button>Изменить</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      projectList: null,
      status: "open",
    };
  },
  async mounted() {
    try {
      this.projectList = await (
        await fetch(`/api/project/${this.status}`)
      ).json();
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style lang="css" scoped>
table {
  border-collapse: collapse;
}
td,
th {
  border: 1px solid rgb(182, 182, 182);
  padding: 0.5rem;
  font-size: 12px;
}
tbody tr:nth-child(odd) {
  background: rgb(240, 240, 240);
}
tbody tr:nth-child(even) {
  background: rgb(230, 230, 230);
}
tbody tr:hover {
  background: rgb(255, 255, 255);
}
</style>
