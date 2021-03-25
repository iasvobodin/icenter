<template>
  <!-- <h2>Введите номер проекта</h2> -->
  <br />
  <div :class="{ border__project: listIsActive }" class="choose__project__holder">
    <input @focus="getProjectList" :class="{ loading: spinnerClass }" class="project_input" v-model="selectedProject"
      placeholder="Введите номер проекта" />
    <div v-if="listIsActive" class="project_list_holder">
      <ul v-if="!filterProjectList" class="project_list">
        <li v-for="(project, index) in fetchUrl" :key="index" @click="chooseProject(index)" class="project_item">
          <p>{{ project }}</p>
        </li>
      </ul>
      <ul v-else class="project_list">
        <li v-for="(project, index) in filterProjectList" :key="index" @click="chooseProject(index)"
          class="project_item">
          <p>{{ project }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    fetchUrl: {
      type: Object,
      default: null
    }
  },
  emits: ["inputProjectEvent", "chooseProjectNumber"],
  data() {
    return {
      selectedProject: null,
      filterProjectList: null,
      listIsActive: false,
      spinnerClass: false
    };
  },
  watch: {
    async selectedProject() {
      await this.getProjectList();
      this.filterProjectList = Object.values(this.fetchUrl).filter(el =>
        el.includes(this.selectedProject)
      );
    },
    fetchUrl() {
      this.listIsActive = true;
      this.spinnerClass = false;
      console.log('watch');
    }
  },
  methods: {
    async getProjectList() {
      this.$emit("inputProjectEvent");
      this.spinnerClass = true;
      if (this.fetchUrl) {
        this.spinnerClass = false;
        this.listIsActive = true;
        this.filterProjectList = this.fetchUrl;
      }
    },
    async chooseProject(index) {
      if (this.filterProjectList) {
        this.selectedProject = this.filterProjectList[index];
      } else {
        this.selectedProject = this.fetchUrl[index];
      }
      let projectNumberQuery = this.selectedProject;
      if (!projectNumberQuery.includes(".")) {
        projectNumberQuery = projectNumberQuery + ".0";
      }
      this.$emit("chooseProjectNumber", projectNumberQuery);
      // this.woList = await (
      //   await fetch(`/api/cabinetList/${projectNumberQuery}`)
      // ).json();
      this.$nextTick(() => {
        this.listIsActive = false;
      });
    }
  }
};
</script>

<style lang="css" scoped>
.border__project{
  padding: 10px;
  border: 1px solid rgb(0, 0, 0);
  border-radius: 5px;
}
.choose__project__holder {
  margin: auto;
  width: min(95vw, 400px);
}
input {
  height: 30px;
  font-size: 16px;
  text-align: center;
  width: 100%;
}
.loading {
  background: url(/img/loading.gif) no-repeat right center;
}
.project__holder {
  width: min(1600px, 95vw);
  display: grid;
  margin: auto;
  grid-template-columns: minmax(300px, 50vw);
  justify-content: space-around;
  column-gap: 5vw;
}
.project_list_holder {
  margin-top: 10px;
  /* cursor: pointer; */
  max-height: 35vh;
  overflow-y: scroll;
}
.project_list {
  display: list-item;
  padding: 0;
  height: inherit;
}
.project_item > p {
  height: 30px;
  font-size: 16px;
  border-radius: 2px;
  padding: 2px;
  margin: 2px;
  list-style: none;
  cursor: pointer;
  border: 1px solid rgb(112, 112, 112);
}
.project_item > p:hover {
  background-color: rgba(55, 158, 255, 0.342);
}
</style>
