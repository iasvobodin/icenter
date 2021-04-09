<template>
  <div>
    <h1>Отчёты</h1>
    <fieldset v-if="false">
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
    <div v-if="projectInformation">
      <choose-wo
        @choose-project-number="chooseCabinet"
        :fetchUrl="projectInformation.cabinets"
      />
      <div v-if="cabinet">
        <cabinet-template
          :project-number="projectInformation.id"
          :project-name="projectInformation.info.base['project name']"
          :cabinet-wo="cabinet.wo"
          :cabinet-name="cabinet['cab name']"
        />
      </div>
    </div>

    <!-- <choose-wo-number
      :multiple-permission="true"
      :cabinetList="projectInformation[0].cabinets"
      v-if="projectInformation"
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
      projectInformation: null,
      projectStatus: "open",
      woState: false,
      cabinet: "",
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
    chooseWoNumber,
  },
  watch: {
    projectStatus(oldv, newv) {
      if (newv === "closed") {
        this.fetchProjectList();
      }
      this.projectData = null;
      // this.choose();
    },
  },
  methods: {
    chooseCabinet(e) {
      this.cabinet = e;
      this.$store.commit("SETcabinetInfo", e);
      this.woState = true;
    },
    choose($event) {
      if (!$event) {
        this.projectInformation = false;
        return;
      }
      this.projectInformation = Object.values(this.fetchProject).filter(
        (e) => e.id === $event
      )[0];
      console.log(this.projectInformation, "this.projectInformation");
      this.$store.commit("SETprojectInfo", this.projectInformation);
    },
    async fetchProjectList() {
      if (!this.projectData) {
        this.fetchProject = await (
          await fetch(`/api/project/${this.projectStatus}`)
        ).json();
        this.projectData = this.fetchProject.map((el) => el.id);
        // this.projectData = this.fetchProject.map(el => el.id);
      }
    },
  },
  setup() {
    return {};
  },
};
</script>

<style lang="css" scoped>
fieldset {
  width: 500px;
  margin: auto;
}
</style>
