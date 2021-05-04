<template>
  <div>
    <h1>Отчёты</h1>
    <fieldset v-if="false">
      <legend>Выберете статус проекта</legend>
      <input
        id="one"
        v-model="projectStatus"
        checked
        type="radio"
        value="open"
      />
      <label for="one">Открытый</label>
      <input id="two" v-model="projectStatus" type="radio" value="closed" />
      <label for="two">Закрытый</label>
    </fieldset>
    <choose-project-number
      :fetch-url="projectData"
      @input-project-event="fetchProjectList"
      @choose-project-number="choose"
    />
    <div v-if="projectInformation">
      <choose-wo
        :fetch-url="projectInformation.cabinets"
        @choose-project-number="chooseCabinet"
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
import chooseProjectNumber from "@/components/chooseProjectNumber.vue";
import chooseWoNumber from "@/components/chooseWoNumber.vue";
import cabinetTemplate from "@/components/cabinetTemplate.vue";
import chooseWo from "@/components/chooseWO.vue";
import projectList from "@/components/projectList.vue";
export default {
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
  setup() {
    return {};
  },
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
};
</script>

<style lang="css" scoped>
fieldset {
  width: 500px;
  margin: auto;
}
</style>
