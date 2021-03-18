<template>
    <div class="project__holder">
        <div class="project">
            <h2>Выберете проект</h2>
            <br>
            <input @focus="getProjectList" :class="{ loading: spinnerClass }" class="project_input"
                v-model="selectedProject" placeholder="Введите номер проекта" />
            <div v-if="listIsActive" class="project_list_holder">
                <ul v-if="!filterProjectList" class="project_list">
                    <li v-for="(project, index) in $store.state.projects.List" :key="index"
                        @click="chooseProject(index)" class="project_item">
                        {{ project }}
                    </li>
                </ul>
                <ul v-else class="project_list">
                    <li v-for="(project, index) in filterProjectList" :key="index" @click="chooseProject(index)"
                        class="project_item">
                        {{ project }}
                    </li>
                </ul>
            </div>
            <div class="cabinet__info">
                <table v-if="woList" style="width: 100%">
                    <colgroup>
                        <col style="width: 20%" />
                        <col style="width: 80%" />
                    </colgroup>
                    <tr style="border: solid 2px orange;" >
                        <th>WO</th>
                        <th>Шкаф</th>
                        <th>Выбрать всё<input @click="checkAll" type="checkbox" /></th>
                    </tr>
                    <tr style="cursor: pointer;" v-for="(value, key, index) in woList" :key="index">
                        <td>{{ value.cabinetInfo.wo }}</td>
                        <td class="tg-0lax">{{ value.cabinetInfo.cabName }}</td>
                        <td class="tg-0lax">
                            <input :ref="setItemRef" type="checkbox" :value="value" v-model="checkedCabinetsNames" />
                        </td>
                    </tr>
                    <!-- <button @click="checkAll">test</button> -->
                </table>
            </div>
        </div>
        <project-info v-if="woList" :cabinets="checkedCabinetsNames" :project="woList[0]" />
    </div>
</template>

<script>
import projectInfo from './projectInfo.vue';
export default {
    components: {
            projectInfo,
        },
        data() {
            return {
                checkbox: [],
                checkedCabinetsNames: [],
                spinnerClass: false,
                selectedProject: null,
                filterProjectList: null,
                woList: null,
                listIsActive: null,
                checkBoxAll: false
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
            checkAll() {
                this.checkBoxAll = !this.checkBoxAll
                if (this.checkBoxAll) {
                    this.checkbox.forEach(e => e.checked = true)
                    this.checkedCabinetsNames = this.woList
                } else {
                    this.checkbox.forEach(e => e.checked = false)
                    this.checkedCabinetsNames = []
                }

            },
            setItemRef(el) {
                !this.checkbox && this.checkbox.push(el)
            },
            async chooseProject(index) {

                if (this.filterProjectList) {
                    this.selectedProject = this.filterProjectList[index]
                } else {
                    this.selectedProject = this.$store.state.projects.List[index]
                }

                //   this.filterProjectList && (this.selectedProject = this.filterProjectList[index])
                let projectNumberQuery = this.selectedProject;
                console.log(projectNumberQuery, "projectNumberQuery");
                if (!projectNumberQuery.includes(".")) {
                    projectNumberQuery = projectNumberQuery + ".0";
                }
                this.woList = await (
                    await fetch(`/api/cabinetList/${projectNumberQuery}`)
                ).json();
                console.log(this.woList[0]);
                this.listIsActive = false;
            },
            async getProjectList() {
                if (this.$store.state.projects.List) {
                    this.listIsActive = true
                    this.filterProjectList = this.$store.state.projects.List
                    return
                } else {
                    this.spinnerClass = true
                    await this.$store.dispatch('GET_projectList')
                    this.spinnerClass = false
                    this.listIsActive = true
                }

            }
        },
}
</script>

<style lang="css" scoped>
.table__header{
    
}
.project__holder{
    width: min(1600px, 95vw);
    display: grid;
    margin: auto;
    grid-template-columns: repeat(auto-fill, minmax(max(30vw, 300px), 1fr));
    justify-content: space-around;
    column-gap: 5vw;
}
.project__info{
    display: grid;
}


.cabinet__info{
   margin-top: 3vh;
}
.project_input {
  width: 100%;
  height: 35px;
  text-align: center;
}
.loading {
    background: url(/img/loading.gif) no-repeat right center;
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