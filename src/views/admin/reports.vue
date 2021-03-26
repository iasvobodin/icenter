<template>
  <div>
    <h1>Проекты</h1>
    <choose-project-number
      @input-project-event="fetchProjectList"
      @choose-project-number="choose"
      :fetchUrl="projectData"
    />
    <choose-wo-number
      :multiple-permission="true"
      :cabinetList="woList[0].cabinets"
      v-if="woList"
    />
    <!-- <projectList /> -->
  </div>
</template>

<script>
import chooseProjectNumber from "@/components/chooseProjectNumber";
import chooseWoNumber from "@/components/chooseWoNumber";
import projectList from "@/components/projectList";
export default {
  data() {
    return {
      projectData: null,
      fetchProject: null,
      woList: null
    };
  },
  components: {
    // eslint-disable-next-line vue/no-unused-components
    projectList,
    chooseProjectNumber,
    chooseWoNumber
  },
  methods: {
    choose($event) {
      // debugger
      if (!$event) {
        this.woList = false;
        return
      }
      this.woList = Object.values(this.fetchProject).filter(
        e => e.id === $event
      );
    },
    async fetchProjectList() {
      if (!this.projectData) {
        this.fetchProject = await (await fetch(`/api/project/open`)).json();
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

<style lang="css" scoped></style>
