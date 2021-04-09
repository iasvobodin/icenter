<template>
  <!-- <h2>Введите номер проекта</h2> -->
  <br />
  <div
    :class="{ border__project: listIsActive }"
    class="choose__project__holder"
  >
    <div class="input__holder">
      <input
        @blur="bl"
        @focus="getProjectList"
        :class="{ loading: spinnerClass }"
        class="project_input"
        v-model="selectedProject"
        placeholder="Введите номер проекта"
      />
      <img
        v-if="selectedProject"
        @click="clearState"
        src="/img/cancel.svg"
        alt=""
      />
    </div>

    <div v-show="listIsActive" class="project_list_holder">
      <ul class="project_list">
        <li
          v-for="(project, index) in filterProject"
          :key="index"
          @click="chooseProject(index)"
          class="project_item"
        >
          <p v-if="typeof project === 'object'">
            <span style="text-align: start">
              {{ project.wo }}
            </span>
            -
            <span style="text-align: end">
              {{ project["cab name"] }}
            </span>
          </p>
          <p v-else>
            <span>
              {{ project }}
            </span>
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    zeroEnd: {
      type: Boolean,
      default: () => false,
    },
    fetchUrl: {
      type: Object,
      default: null,
    },
  },
  emits: ["inputProjectEvent", "chooseProjectNumber"],
  data() {
    return {
      selectedProject: null,
      projectNumberQuery: null,
      filterProjectList: null,
      listIsActive: false,
      spinnerClass: false,
    };
  },
  computed: {
    filterProject() {
      if (this.selectedProject) {
        if (typeof Object.values(this.fetchUrl)[0] === "object") {
          return Object.values(this.fetchUrl).filter(
            (el) =>
              (el.wo && el.wo.includes(this.selectedProject)) ||
              (el["cab name"] &&
                el["cab name"]
                  .toLowerCase()
                  .includes(this.selectedProject.toLowerCase()))
          );
        } else {
          return Object.values(this.fetchUrl).filter((el) =>
            el.includes(this.selectedProject)
          );
        }
      } else {
        return this.fetchUrl;
      }
    },
  },
  watch: {
    // selectedProject() {
    //   if (this.fetchUrl) {
    //     this.filterProjectList = Object.values(this.fetchUrl).filter(el =>
    //       el.includes(this.selectedProject)
    //     );
    //   }
    // },
    fetchUrl() {
      this.listIsActive = true;
      this.spinnerClass = false;
    },
  },
  methods: {
    bl() {
      setTimeout(() => (this.listIsActive = false), 200);
    },
    clearState() {
      this.selectedProject = null;
      this.$emit("chooseProjectNumber", this.selectedProject);
      this.$store.commit("SETprojectNumber", null);
    },
    getProjectList() {
      this.$emit("inputProjectEvent");
      this.spinnerClass = true;
      if (this.fetchUrl) {
        this.spinnerClass = false;
        this.listIsActive = true;
        this.filterProjectList = this.fetchUrl;
      }
    },
    chooseProject(index) {
      this.$store.commit("SETprojectNumber", this.filterProject[index]);
      this.selectedProject = this.filterProject[index];
      this.projectNumberQuery = this.selectedProject;
      this.$emit("chooseProjectNumber", this.projectNumberQuery);

      this.bl();
    },
  },
};
</script>

<style lang="css" scoped>
.input__holder {
  position: relative;
}
.input__holder > img {
  cursor: pointer;
  height: 20px;
  /* padding: 7px; */
  position: absolute;
  right: 5px;
  top: 5px;
}
p {
  margin: 0;
  /* display: flex;
  align-items: stretch; */
}
ul {
  margin: 0;
}
.border__project {
  padding: 5px;
  border: 1px solid orange;
  border-radius: 5px;
}
.choose__project__holder {
  margin: auto;
  width: min(95vw, 400px);
}
input {
  height: 30px;
  border: 1px solid orange;
  border-radius: 5px;
  line-height: 30px;
  font-size: 20px;
  text-align: center;
  width: 100%;
  margin: auto;
  padding: 0px;
}
span {
  padding-left: 5px;
  padding-right: 5px;
  line-height: 30px;
  /* display: inline-block; */
  /* width: 50%; */
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
  margin-bottom: 10px;
  /* cursor: pointer; */
  max-height: 35vh;
  overflow-y: scroll;
}
.project_list {
  display: list-item;
  padding: 0;
  height: inherit;
}
li {
  border-bottom: 1px solid black;
}
ul {
  border: 1px solid black;
  border-radius: 5px;
  border-bottom: 0px;
}
.project_item {
  height: 30px;
  font-size: 16px;
  /* border-radius: 2px;
  padding: 2px;
  margin: 2px; */
  list-style: none;
  cursor: pointer;
  /* border: 1px solid rgb(112, 112, 112); */
}
.project_item:hover {
  background-color: rgba(55, 158, 255, 0.342);
}
</style>
