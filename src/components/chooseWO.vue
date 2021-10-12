<template>
  <!-- <h2>Введите номер проекта</h2> -->
  <br />
  <div
    :class="{ border__project: listIsActive }"
    class="choose__project__holder"
  >
    <div class="input__holder">
      <input
        v-model="selectedProject"
        :class="{ loading: spinnerClass }"
        class="project_input"
        placeholder="Введите номер WO"
        @blur="bl"
        @focus="getProjectList"
      />
      <img
        v-if="selectedProject"
        src="/img/cancel.svg"
        alt=""
        @click="clearState"
      />
    </div>

    <div v-if="listIsActive" class="project_list_holder">
      <ul class="project_list">
        <li
          v-for="(project, index) in filterProject"
          :key="index"
          class="project_item"
          @click="chooseProject(index)"
        >
          <p>
            <span style="text-align: start">
              {{ project.wo }}
            </span>
            -
            <span style="text-align: end">
              {{ project['cab name'] }}
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
  emits: ['inputProjectEvent', 'chooseProjectNumber'],
  data() {
    return {
      selectedProject: null,
      projectNumberQuery: null,
      filterProjectList: null,
      listIsActive: false,
      spinnerClass: false,
    }
  },
  computed: {
    filterProject() {
      if (this.selectedProject) {
        return Object.values(this.fetchUrl).filter(
          (el) =>
            (el.wo && el.wo.includes(this.selectedProject)) ||
            (el['cab name'] &&
              el['cab name']
                .toLowerCase()
                .includes(this.selectedProject.toLowerCase()))
        )
      } else {
        return this.fetchUrl
      }
    },
  },
  watch: {
    fetchUrl() {
      this.listIsActive = true
      this.spinnerClass = false
      // console.log("watch");
    },
  },
  methods: {
    bl() {
      setTimeout(() => (this.listIsActive = false), 200)
    },
    clearState() {
      this.selectedProject = null
      this.$emit('chooseProjectNumber', this.selectedProject)
    },
    getProjectList() {
      this.$emit('inputProjectEvent')
      this.spinnerClass = true
      if (this.fetchUrl) {
        this.spinnerClass = false
        this.listIsActive = true
        this.filterProjectList = this.fetchUrl
      }
    },
    async chooseProject(index) {
      this.selectedProject = `${this.fetchUrl[index].wo} ${this.fetchUrl[index]['cab name']}`

      this.$emit('chooseProjectNumber', this.fetchUrl[index])

      this.$nextTick(() => {
        this.listIsActive = false
      })
    },
  },
}
</script>

<style lang="css" scoped>
li > span {
  display: block;
  width: 50%;
}
li {
  display: flex;
}
.input__holder {
  position: relative;
}
p {
  margin: 0;
  /* display: flex;
  align-items: stretch; */
}
ul {
  margin: 0;
}
span {
  padding-left: 5px;
  padding-right: 5px;
  line-height: 30px;
  /* display: inline-block; */
  /* width: 50%; */
}
.input__holder > img {
  cursor: pointer;
  height: 12px;
  /* padding: 7px; */
  position: absolute;
  right: 9px;
  top: 9px;
}
.border__project {
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
