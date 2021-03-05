<template>
  <!-- <section class="add__error"> -->
  <!-- <div class="p-grid p-mx-auto">
  <Dropdown
  style="width:300px"
  class="p-col"
    @before-show="getProjectTest"
    @change="chooseProjectTest"
    v-model="selectedProject"
    :options="projectsList"
    :filter="true"
    scrollHeight="300px"
    placeholder="Введите номер проекта"
    :showClear="true"
  >
    <template #value="slotProps">
      <div class="country-item country-item-value" v-if="slotProps.value">
        <div>{{ slotProps.value }}</div>
      </div>
      <span v-else>
        {{ slotProps.placeholder }}
      </span>
    </template>
  </Dropdown>
  <ProgressSpinner  class="preloader p-col" v-if="showPreloader" />
</div>


  <br />
  <br />
  <h2 v-if="selectedProject">Выберете шкаф</h2>
  <DataTable
  style="width:min(90vw, 400px); margin: auto;"
  v-if="selectedProject"
    :value="woListTest"
    v-model:selection="selectedCabinet"
    selectionMode="single"
    dataKey="id"
    class="p-datatable-sm"
  >
    <Column field="id" header="WO"></Column>
    <Column field="cabName" header="Cabinet"></Column>
  </DataTable> -->
  <!-- </section> -->

  <!-- <button @click="testFetch">TEST FETCH</button> -->
  <h2>Выберете проект</h2>
  <br>
  <div class="project">

    <!-- <button @click="getProject">Выбрать проект</button> -->
    <input @focus="getProject" @input="listIsActive = true" class="project_input" v-model="message"
      placeholder="Введите номер проекта" />
    <div v-if="listIsActive" class="project_list_holder">
      <ul class="project_list">
        <li v-for="(project, index) in filterList" :key="index" @click="chooseProject(index)" class="project_item">
          {{ project }}
        </li>
      </ul>
    </div>
    <h4 v-if="message">Выбранный проект №:{{ message }}</h4>
  </div>
  <h2 v-if="selectedProject">Выберете шкаф</h2>
  <div class="project">
    <table style="width: 100%">
      <colgroup>
        <col style="width: 20%" />
        <col style="width: 80%" />
      </colgroup>
      <tr>
        <th>WO</th>
        <th>Шкаф</th>
        <th>Выбрать</th>
      </tr>
      <tr style="cursor: pointer;" v-for="(wo, index) in woList" :key="index">
        <td>{{ wo.id }}</td>
        <td class="tg-0lax">{{ wo.cabinetInfo.cabName }}</td>
        <td class="tg-0lax">
          <input type="checkbox" :value="wo.id" v-model="checkedNames" />
        </td>
      </tr>
    </table>
<div v-if="checkedNames" class="choose__information">
    <h4> Выбранные шкафы </h4>
    <ul v-for="(cabinet, index) in checkedNames " :key="index">
      <li>{{cabinet}}</li>
    </ul>
</div>



    <!-- <ul class="project_list">
      <li class="project_item" v-for="(wo, index) in woList" :key="index">
        WO№ - {{ wo.id }} <br />
        Название шкафа - {{ wo.cabinetInfo.cabName }}
      </li>
    </ul> -->
  </div>
</template>

<script>
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ProgressSpinner from "primevue/progressspinner";
// import ColumnGroup from 'primevue/columngroup';
// eslint-disable-next-line no-unused-vars
import { computed, reactive, ref, watch } from "vue";
export default {
  data() {
    return {
      checkedNames: [],
      selectedProject: null,
      projectsList: null,
      woListTest: null,
      selectedProjectCorrection: null,
      selectedCabinet: null,
      showPreloader: false
    };
  },
  methods: {
    async getProjectTest() {
      this.showPreloader = true;
      !this.projectsList &&
        (this.projectsList = await (
          await fetch(`/api/projectstatus/Open`)
        ).json());
      this.showPreloader = false;
    },
    async chooseProjectTest() {
      this.showPreloader = true;
      if (!this.selectedProject.includes(".")) {
        this.selectedProject = this.selectedProject + ".0";
      }
      let list = await (
        await fetch(`/api/cabinetList/${this.selectedProject}`)
      ).json();
      this.woListTest = list.map(el => {
        return {
          id: el.id,
          szNumber: el.cabinetInfo.szNumber,
          projectName: el.cabinetInfo.projectName,
          cabName: el.cabinetInfo.cabName,
          dimensions: el.cabinetInfo.dimensions,
          weight: el.cabinetInfo.weight,
          pm: el.cabinetInfo.pm,
          buyer: el.cabinetInfo.buyer,
          contractAdministrator: el.cabinetInfo.contractAdministrator,
          buyoutAdministrator: el.cabinetInfo.buyoutAdministrator,
          leadEngineer: el.cabinetInfo.leadEngineer,
          hardwareEngineer: el.cabinetInfo.hardwareEngineer
        };
      });
      this.showPreloader = false;
    }
  },
  setup() {
    const selctedWO = reactive({ wo: null, cabName: null });
    const message = ref(null);
    const listIsActive = ref(null);
    const filterList = ref(null);
    const getProjectVisible = ref(null);
    const woList = ref(null);
    let dataProject;

    const getProject = async () => {
     !dataProject && (dataProject = await (await fetch(`/api/projectstatus/Open`)).json())
      getProjectVisible.value = true;
    };

    const testFetch = async () => {
      await fetch("/api/postError", {
        method: "POST", // или 'PUT'
        body: JSON.stringify({
          id: "666",
          data: "testChange2",
          newdata: {
            test: "testChange",
             test1111: "testChange1111",
             error: {status: "closed",
             timestamp: Date.now()
             }
            }
        })
      });
    };

    const chooseWO = index => {
      console.log(
        woList.value[index].id,
        woList.value[index].cabinetInfo.cabName
      );
    };
    // (async function() {
    //   dataProject = await (await fetch(`/api/projectstatus/Open`)).json();
    // })();
    const chooseProject = async index => {
      listIsActive.value = false;
      message.value = filterList.value[index];
      let projectNumberQuery = message.value;
      if (!projectNumberQuery.includes(".")) {
        projectNumberQuery = projectNumberQuery + ".0";
      }
        woList.value = await (
          await fetch(`/api/cabinetList/${projectNumberQuery}`)
        ).json();
    };
    watch(message, async() => {
      await getProject()
    filterList.value = dataProject.filter(el => el.includes(message.value));
    });
    return {
      message,
      filterList,
      chooseProject,
      listIsActive,
      woList,
      getProject,
      getProjectVisible,
      testFetch,
      chooseWO,
      selctedWO
    };
  },
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Button: Button,
    // eslint-disable-next-line vue/no-unused-components
    Dropdown: Dropdown,
    // eslint-disable-next-line vue/no-unused-components
    DataTable: DataTable,
    // eslint-disable-next-line vue/no-unused-components
    Column: Column,
    // eslint-disable-next-line vue/no-unused-components
    ProgressSpinner: ProgressSpinner
  }
};
</script>

<style lang="css" scoped>
.add__error {
  position: relative;
  /* width: 50%;
  margin: auto; */
}
.preloader {
  position: absolute;
  width: 50px;
  margin: auto;
  top: 0;
  /* top: 30px;
  left: 30px; */
}
.tg {
  border-collapse: collapse;
  border-spacing: 0;
  border-color: #aaa;
}
.tg td {
  font-family: Arial, sans-serif;
  font-size: 14px;
  padding: 10px 5px;
  border-style: solid;
  border-width: 1px;
  overflow: hidden;
  word-break: normal;
  border-color: #aaa;
  color: #333;
  background-color: #fff;
}
.tg th {
  font-family: Arial, sans-serif;
  font-size: 14px;
  font-weight: normal;
  padding: 10px 5px;
  border-style: solid;
  border-width: 1px;
  overflow: hidden;
  word-break: normal;
  border-color: #aaa;
  color: #fff;
  background-color: #f38630;
}
.tg-0lax {
  text-align: left;
  width: 100%;
  vertical-align: top;
}
.wo_right {
  text-align: right;
  width: 50%;
}
.wo_left {
  text-align: left;
  width: 50%;
}
.project_input {
  width: 100%;
  height: 35px;
  text-align: center;
}
.project {
  margin: auto;
  width: max(200px, 40vw);
}
.project_list_holder {
  cursor: pointer;
  max-height: 40vh;
  overflow-y: scroll;
}
.project_list {
  display: list-item;
  padding: 0;
  height: inherit;
}
.project_item {
  border-radius: 2px;
  padding: 2px;
  margin: 2px;
  list-style: none;
}
.project_item:hover {
  background-color: rgb(255, 191, 94);
}
</style>
