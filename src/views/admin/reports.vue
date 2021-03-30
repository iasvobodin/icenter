<template>
  <div>
    <h1>Отчёты</h1>
    <fieldset>
      <legend>Выберете статус проекта</legend>
      <input
        checked
        type="radio"
        id="one"
        value="open"
        v-model="projectStatus"
      />
      <label for="one">Открытый</label>
      <input type="radio" id="two" value="closed" v-model="projectStatus" />
      <label for="two">Закрытый</label>
    </fieldset>
    <choose-project-number
      @input-project-event="fetchProjectList"
      @choose-project-number="choose"
      :fetchUrl="projectData"
    />
    <!-- <choose-project-number v-if="woList" :fetchUrl="woList[0].cabinets"  @choose-project-number="chooseCabinet" /> -->
    <div v-if="woList">
      <choose-wo
        @choose-project-number="chooseCabinet"
        :fetchUrl="woList[0].cabinets"
      />
      <div v-if="cabinet">
        <cabinet-template
          :project-number="woList[0].id"
          :project-name="woList[0].info.base['project name']"
          :cabinet-wo="cabinet.wo"
          :cabinet-name="cabinet['cab name']"
        />
      </div>
    </div>

    <!-- <choose-wo-number
      :multiple-permission="true"
      :cabinetList="woList[0].cabinets"
      v-if="woList"
    /> -->
    <!-- <projectList /> -->
  </div>
</template>

<script>
import chooseProjectNumber from "@/components/chooseProjectNumber";
import chooseWoNumber from "@/components/chooseWoNumber";
import cabinetTemplate from "@/components/cabinetTemplate";
import chooseWo from "@/components/chooseWO";
import projectList from "@/components/projectList";
export default {
  data() {
    return {
      projectData: null,
      fetchProject: null,
      woList: null,
      projectStatus: "open",
      woState: false,
      cabinet: ""
    };
  },
  components: {
    cabinetTemplate,
    // eslint-disable-next-line vue/no-unused-components
    projectList,
    // eslint-disable-next-line vue/no-unused-components
    chooseWo,
    chooseProjectNumber,
    // eslint-disable-next-line vue/no-unused-components
    chooseWoNumber
  },
  watch: {
    projectStatus(oldv, newv) {
      if (newv === "closed") {
        this.fetchProjectList();
      }
      this.projectData = null;
      // this.choose();
    }
  },
  methods: {
    chooseCabinet(e) {
      this.cabinet = e;
      this.woState = true;
    },
    choose($event) {
      // debugger
      if (!$event) {
        this.woList = false;
        return;
      }
      this.woList = Object.values(this.fetchProject).filter(
        e => e.id === $event
      );
    },
    async fetchProjectList() {
      if (!this.projectData) {
        this.fetchProject = await (
          await fetch(`/api/project/${this.projectStatus}`)
        ).json();
        this.projectData = this.fetchProject.map(el => el.id);
        // this.projectData = this.fetchProject.map(el => el.id);
      }
    }
  },
  setup() {
    return {};
  }
};
</script>

<style lang="css" scoped>
fieldset {
  width: 500px;
  margin: auto;
}
</style>
