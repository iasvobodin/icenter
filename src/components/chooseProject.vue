<template>
    <div class="project">
        <h2 style="color:red">Выберете проект</h2>
        <br>
        <input @focus="getProjectList" @input="listIsActive = true" :class="{ loading: spinnerClass }"
            class="project_input" v-model="selectedProject" placeholder="Введите номер проекта" />
        <div v-if="listIsActive" class="project_list_holder">
            <ul class="project_list">
                <li v-for="(project, index) in filterProjectList" :key="index" @click="chooseProject(index)"
                    class="project_item">
                    {{ project }}
                </li>
            </ul>
        </div>
        <div class="project__info">
        SZ№ {{woList[0].cabinetInfo.szNumber}}
        <br>
          Название проекта  {{woList[0].cabinetInfo.projectName}}
          <br>
            {{woList[0].cabinetInfo.cabName}}
            {{woList[0].cabinetInfo.dimensions}}
            {{woList[0].cabinetInfo.weight}}
            {{woList[0].cabinetInfo.pm}}
            {{woList[0].cabinetInfo.buyer}}
            {{woList[0].cabinetInfo.contractAdministrator}}
            {{woList[0].cabinetInfo.buyoutAdministrator}}
            {{woList[0].cabinetInfo.leadEngineer}}
            {{woList[0].cabinetInfo.hardwareEngineer}}
             <!-- <ul >
                <li v-for="(value, name, index) in woList[0].cabinetInfo" :key="index"
                    >
                 {{name}}   {{value }}
                </li>
            </ul> -->
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            spinnerClass: false,
            selectedProject: null,
            filterProjectList: null,
            woList: null,
            listIsActive: null,
        }
    },
    // mounted () {
    //     console.log(this.$store.state.projectList, 'qqqqqqqqqqqqqqqqqqqq');;
    // },
    watch: {
        async selectedProject() {
            await this.getProjectList()
            this.filterProjectList = Object.values(this.$store.state.projects.List).filter(el => el.includes(this.selectedProject));
        }
    },
    methods: {
      async chooseProject (index) {
      this.listIsActive = false;
      this.selectedProject = this.filterProjectList[index];
      let projectNumberQuery = this.selectedProject;
      if (!projectNumberQuery.includes(".")) {
        projectNumberQuery = projectNumberQuery + ".0";
      }
        this.woList = await (
          await fetch(`/api/cabinetList/${projectNumberQuery}`)
        ).json();
    },
        async getProjectList() {
            if (this.$store.state.projects.List) {
                return
            }
            this.spinnerClass = true
            await this.$store.dispatch('GET_projectList')
            this.spinnerClass = false
        }
    },
}
</script>

<style lang="css" scoped>
.project{
    width: max(200px, 40vw);
}
.project_input {
  width: 100%;
  height: 35px;
  text-align: center;
}
.loading {
    background: url(http://www.xiconeditor.com/image/icons/loading.gif) no-repeat right center;
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
  border-bottom: 1px solid rgb(112, 112, 112);
}
.project_item:hover {
  background-color: rgba(55, 158, 255, 0.658);
}
</style>