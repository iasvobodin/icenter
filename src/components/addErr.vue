<template>
  <Dropdown
    style="width:250px;"
    @before-show="getProjectTest"
    @change="chooseProjectTest"
    v-model="selectedProject"
    :options="projectsList"
    :filter="true"
    scrollHeight="300px"
    placeholder="Выберете номер проекта"
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
    <!-- <template #option="slotProps">
        <div class="country-item">
            <div>{{slotProps.option.name}}</div>
        </div>
    </template> -->
  </Dropdown>
<br>
<br>
    <DataTable
    style="width:50%; margin: auto;"
      :value="woListTest"
      v-model:selection="selectedCabinet"
      selectionMode="single"
      dataKey="id"
      class="p-datatable-sm p-d-block"
    >
      <Column field="id" header="WO"></Column>
      <Column field="cabName" header="Cabinet"></Column>
    </DataTable>

  <br />
  <br />
  <h1>Добавить ошибку</h1>
  <div class="project">
    <h4>Выбранный проект №:{{ message }}</h4>
    <button @click="getProject">Выбрать проект</button>
    <br />
    <!-- <button @click="testFetch">TEST FETCH</button> -->
    <input
      v-if="getProjectVisible"
      @input="listIsActive = true"
      class="project_input"
      v-model="message"
      placeholder="Введите номер проекта"
    />
    <div v-if="listIsActive" class="project_list_holder">
      <ul class="project_list">
        <li
          v-for="(project, index) in filterList"
          :key="index"
          @click="chooseProject(index)"
          class="project_item"
        >
          {{ project }}
        </li>
      </ul>
    </div>
  </div>
  <div class="project">
    <table style="width: 100%">
      <colgroup>
        <col style="width: 50%" />
        <col style="width: 50%" />
      </colgroup>
      <tr>
        <th>WO</th>
        <th>Шкаф</th>
      </tr>
      <tr v-for="(wo, index) in woList" :key="index">
        <td>{{ wo.id }}</td>
        <td class="tg-0lax">{{ wo.cabinetInfo.cabName }}</td>
        <td>
          <button
            @click="
              (selctedWO.wo = wo.id)(
                (selctedWO.cabName = wo.cabinetInfo.cabName)
              )
            "
          >
            Choose
          </button>
        </td>
      </tr>
    </table>

    <h4>Выбранный шкаф {{ selctedWO.cabName }} WO {{ selctedWO.wo }}</h4>

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
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
// import ColumnGroup from 'primevue/columngroup'; 
// eslint-disable-next-line no-unused-vars
import { computed, reactive, ref, watch } from "vue";
export default {
  data() {
    return {
      selectedProject: null,
      projectsList: null,
      woListTest: null,
      selectedProjectCorrection: null,
      selectedCabinet: null,
    };
  },
  methods: {
    async getProjectTest() {
      !this.projectsList &&
        (this.projectsList = await (
          await fetch(`/api/projectstatus/Open`)
        ).json());
    },
    async chooseProjectTest() {
      if (!this.selectedProject.includes(".")) {
        this.selectedProject = this.selectedProject + ".0";
      }
      let list = await (
        await fetch(`/api/cabinetList/${this.selectedProject}`)
      ).json()
      this.woListTest = list.map(el => {
       return {id: el.id,
      szNumber: el.cabinetInfo.szNumber,
      projectName:el.cabinetInfo.projectName,
      cabName:el.cabinetInfo.cabName,
      dimensions:el.cabinetInfo.dimensions,
      weight:el.cabinetInfo.weight,
      pm:el.cabinetInfo.pm,
      buyer:el.cabinetInfo.buyer,
      contractAdministrator:el.cabinetInfo.contractAdministrator,
      buyoutAdministrator:el.cabinetInfo.buyoutAdministrator,
      leadEngineer:el.cabinetInfo.leadEngineer,
      hardwareEngineer:el.cabinetInfo.hardwareEngineer
       }
      });
      
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
      dataProject = await (await fetch(`/api/projectstatus/Open`)).json();
      getProjectVisible.value = true;
    };

    const testFetch = async () => {
      await fetch("/api/postError", {
        method: "POST", // или 'PUT'
        body: JSON.stringify({
          id: "44345",
          data: "test"
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
    const chooseProject = index => {
      listIsActive.value = false;
      message.value = filterList.value[index];
      let projectNumberQuery = message.value;
      if (!projectNumberQuery.includes(".")) {
        projectNumberQuery = projectNumberQuery + ".0";
      }
      (async function() {
        woList.value = await (
          await fetch(`/api/cabinetList/${projectNumberQuery}`)
        ).json();
      })();
    };
    watch(message, () => {
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
    Dropdown: Dropdown,
    DataTable: DataTable,
    Column:Column
  }
};
</script>

<style lang="css" scoped>
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
.tg .tg-0lax {
  text-align: left;
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
  height: 25px;
  text-align: center;
}
.project {
  margin: auto;
  width: max(200px, 20vw);
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
