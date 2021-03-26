<template>
  <!-- <h2>Введите номер проекта</h2> -->
  <br />
  <div
    :class="{ border__project: listIsActive }"
    class="choose__project__holder"
  >
  <div class="input__holder">
    <input
      @focus="getProjectList"
      :class="{ loading: spinnerClass }"
      class="project_input"
      v-model="selectedProject"
      placeholder="Введите номер проекта"
    />
    <img v-if="selectedProject" @click="clearState" src="/img/cancel.svg" alt="">
  </div>

    <div v-if="listIsActive" class="project_list_holder">
      <ul class="project_list">
        <li
          v-for="(project, index) in filterProject"
          :key="index"
          @click="chooseProject(index)"
          class="project_item"
        >
         <span>
           {{ project }}
           </span> 
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
      default: () => false
    },
    fetchUrl: {
      type: Object,
      default: null
    }
  },
  emits: ["inputProjectEvent", "chooseProjectNumber"],
  data() {
    return {
      selectedProject: null,
      projectNumberQuery: null,
      filterProjectList: null,
      listIsActive: false,
      spinnerClass: false
    };
  },
    computed: {
    filterProject() {
      if (this.selectedProject) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        return Object.values(this.fetchUrl).filter(el =>
          el.includes(this.selectedProject)
        );;
      } else {
        return this.fetchUrl;
      }
    }
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
      // console.log("watch");
    }
  },
  methods: {
    clearState(){
      this.selectedProject = null
      this.$emit("chooseProjectNumber", this.selectedProject);
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
    async chooseProject(index) {
      // if (this.filterProjectList) {
        this.selectedProject = this.filterProject[index];
      // } else {
      //   this.selectedProject = this.fetchUrl[index];
      // }
       this.projectNumberQuery = this.selectedProject;
      if (!this.projectNumberQuery.includes(".")&& this.zeroEnd) {
        this.projectNumberQuery = this.projectNumberQuery + ".0";
      }
      this.$emit("chooseProjectNumber", this.projectNumberQuery);
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
.input__holder{
  position: relative;
}
.input__holder>img{
  cursor: pointer;
  height: 30px;
  padding: 7px;
  position: absolute;
  right: 0px;
}
.border__project {
  padding: 10px;
  border: 1px solid rgb(0, 0, 0);
  border-radius: 5px;
}
.choose__project__holder {
  margin: auto;
  width: min(80vw, 400px);
}
input {
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  text-align: center;
  width: 100%;
}
span{
  line-height: 30px;
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
li{
  border-bottom: 1px solid black
}
ul{
  border: 1px solid black;
  border-radius: 5px;
}
.project_item  {
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
