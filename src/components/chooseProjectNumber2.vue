<template>
  <div
    :class="{ border__project: listIsActive }"
    class="choose__project__holder"
  >
    <div class="input__holder">
      <input
        v-model.lazy="selectedProject"
        type="search"
        list="projetList"
        placeholder="Введите номер проекта"
      />
      <!-- @focus.once="getProjectList" -->
      <datalist id="projetList">
        <option v-for="pr in dataToRender" :key="pr" :value="pr" />
      </datalist>
    </div>

    <!-- <div v-show="listActive" class="project_list_holder">
      <ul class="project_list">
        <li
          v-for="(project, index) in filterProject"
          :key="index"
          class="project_item"
          @click="chooseProject(index)"
        >
          <p>{{ project }}</p>
        </li>
      </ul>
    </div> -->
  </div>
</template>

<script>
import { toRefs, watch, ref } from 'vue'
import { useStore } from 'vuex'
export default {
  props: {
    dataToRender: {
      type: Array,
      default: null,
    },
  },
  emits: ['inputProjectEvent', 'chooseProjectNumber'],
  setup(props, { emit }) {
    const store = useStore()
    // const { dataToRender } = toRefs(props)
    const selectedProject = ref('')
    watch(selectedProject, () => {
      emit('chooseProjectNumber', selectedProject.value)
      store.commit('SETprojectNumber', selectedProject.value)
    })
    const getProjectList = () => {
      emit('inputProjectEvent')
    }
    getProjectList()
    return {
      selectedProject,
      // getProjectList,
      // eslint-disable-next-line vue/no-dupe-keys
      // dataToRender
    }
  },
  // data() {
  //   return {
  //     selectedProject: null,
  //     projectNumberQuery: null,
  //     filterProjectList: null,
  //     listIsActive: false,
  //     spinnerClass: false,
  //   };
  // },
  // computed: {
  //   filterProject() {
  //     if (this.selectedProject) {
  //         return Object.values(this.dataToRender).filter((el) =>
  //           el.includes(this.selectedProject)
  //         );
  //     } else {
  //       return this.dataToRender;
  //     }
  //   },
  // },
  // mounted () {
  //   this.getProjectList();
  // },
  // watch: {
  //   dataToRender() {
  //     this.listIsActive = true;
  //     this.spinnerClass = false;
  //   },
  //   selectedProject(){
  //     console.log("change!!!!!!!!!")
  //   }
  // },
  // methods: {
  //   bl() {
  //     setTimeout(() => (this.listIsActive = false), 200);
  //   },
  //   clearState() {
  //     this.selectedProject = null;
  //     this.$emit("chooseProjectNumber", this.selectedProject);
  //     this.$store.commit("SETprojectNumber", null);
  //   },
  //   getProjectList() {
  //     this.$emit("inputProjectEvent");
  //     this.spinnerClass = true;
  //     if (this.dataToRender) {
  //       this.spinnerClass = false;
  //       this.listIsActive = true;
  //       this.filterProjectList = this.dataToRender;
  //     }
  //   },
  //   chooseProject(index) {
  //     this.$store.commit("SETprojectNumber", this.filterProject[index]);
  //     this.selectedProject = this.filterProject[index];
  //     this.projectNumberQuery = this.selectedProject;
  //     this.$emit("chooseProjectNumber", this.projectNumberQuery);

  //     this.bl();
  //   },
  // },
}
</script>

<style lang="css" scoped>
datalist {
  height: 30vh;
  max-height: 30vh;
}
.input__holder {
  position: relative;
}
.input__holder > img {
  cursor: pointer;
  height: 12px;
  /* padding: 7px; */
  position: absolute;
  right: 9px;
  top: 9px;
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
  font-size: 18px;
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
option {
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
