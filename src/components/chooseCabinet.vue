<template>
  <h2>Выберете проект</h2>
  <br />
  <div class="project">
    <!-- <button @click="getProject">Выбрать проект</button> -->
    <input
      v-model="selectedProjectNumber"
      class="project_input"
      placeholder="Введите номер проекта"
      @focus="getProject"
      @input="listIsActive = true"
    />
    <div v-if="listIsActive" class="project_list_holder">
      <ul class="project_list">
        <li
          v-for="(project, index) in filterList"
          :key="index"
          class="project_item"
          @click="chooseProject(index)"
        >
          {{ project }}
        </li>
      </ul>
    </div>
    <div v-if="!listIsActive" class="project__info">
      <h4>Выбранный проект №:{{ selectedProjectNumber }}</h4>
    </div>
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
      <tr v-for="(wo, index) in woList" :key="index" style="cursor: pointer">
        <td>{{ wo.id }}</td>
        <td class="tg-0lax">{{ wo.cabinetInfo.cabName }}</td>
        <td class="tg-0lax">
          <input v-model="checkedNames" type="checkbox" :value="wo" />
        </td>
      </tr>
    </table>

    <div v-if="checkedNames" class="choose__information">
      <h4>Выбранные шкафы</h4>
      <ul v-for="(cabinet, index) in checkedNames" :key="index">
        <li>{{ cabinet.id }}</li>
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
// import ColumnGroup from 'primevue/columngroup';
// eslint-disable-next-line no-unused-vars
import { computed, reactive, ref, watch } from 'vue'
export default {
  components: {},
  setup() {
    const selctedWO = reactive({ wo: null, cabName: null })
    const selectedProjectNumber = ref(null)
    const listIsActive = ref(null)
    const filterList = ref(null)
    const getProjectVisible = ref(null)
    const woList = ref(null)
    // const loadingSpinner = ref(false);
    let dataProject

    const getProject = async () => {
      // loadingSpinner.value = true
      if (!dataProject) {
        dataProject = await (await fetch(`/api/projectstatus/Open`)).json()
        getProjectVisible.value = true
        // loadingSpinner.value = false
      }
      //  !dataProject && (dataProject = await (await fetch(`/api/projectstatus/Open`)).json())
    }

    const testFetch = async () => {
      await fetch('/api/postError', {
        method: 'POST', // или 'PUT'
        body: JSON.stringify({
          id: '666',
          data: 'testChange2',
          newdata: {
            test: 'testChange',
            test1111: 'testChange1111',
            error: { status: 'closed', timestamp: Date.now() },
          },
        }),
      })
    }

    const chooseWO = (index) => {
      console.log(
        woList.value[index].id,
        woList.value[index].cabinetInfo.cabName
      )
    }
    // (async function() {
    //   dataProject = await (await fetch(`/api/projectstatus/Open`)).json();
    // })();
    const chooseProject = async (index) => {
      listIsActive.value = false
      selectedProjectNumber.value = filterList.value[index]
      let projectNumberQuery = selectedProjectNumber.value
      if (!projectNumberQuery.includes('.')) {
        projectNumberQuery = projectNumberQuery + '.0'
      }
      woList.value = await (
        await fetch(`/api/cabinetList/${projectNumberQuery}`)
      ).json()
    }
    watch(selectedProjectNumber, async () => {
      await getProject()
      filterList.value = dataProject.filter((el) =>
        el.includes(selectedProjectNumber.value)
      )
    })
    return {
      selectedProjectNumber,
      filterList,
      chooseProject,
      listIsActive,
      woList,
      getProject,
      getProjectVisible,
      testFetch,
      chooseWO,
      selctedWO,
    }
  },
  data() {
    return {
      checkedNames: [],
      selectedProject: null,
      projectsList: null,
      woListTest: null,
      selectedProjectCorrection: null,
      selectedCabinet: null,
      showPreloader: false,
    }
  },
  mounted() {
    console.log(this.$store.state.testState, 'qqqqqqqqqqqqqqqqqqqq')
  },
  methods: {
    async getProjectTest() {
      this.showPreloader = true
      !this.projectsList &&
        (this.projectsList = await (
          await fetch(`/api/projectstatus/Open`)
        ).json())
      this.showPreloader = false
    },
    async chooseProjectTest() {
      this.showPreloader = true
      if (!this.selectedProject.includes('.')) {
        this.selectedProject = this.selectedProject + '.0'
      }
      let list = await (
        await fetch(`/api/cabinetList/${this.selectedProject}`)
      ).json()
      this.woListTest = list.map((el) => {
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
          hardwareEngineer: el.cabinetInfo.hardwareEngineer,
        }
      })
      this.showPreloader = false
    },
  },
}
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
.loading {
  background: url(http://www.xiconeditor.com/image/icons/loading.gif) no-repeat
    right center;
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
