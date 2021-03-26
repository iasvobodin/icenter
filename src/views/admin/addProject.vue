<template>
  <div>
    <h2>
      ADD PROJECT
    </h2>
    <!-- <chooseProjectNumber
 @input-project-event="fetchProjectList" 
 @choose-project-number="choose"
 :fetchUrl="projectData"
 /> -->
    <chooseProject  />
  </div>
</template>

<script>
// import chooseCabinet from "../../components/chooseCabinet";
import chooseProject from "@/components/chooseProject";
import chooseProjectNumber from "@/components/chooseProjectNumber";
export default {
  data() {
    return {
      projectData: null
    };
  },
  methods: {
    choose($event) {
      console.log($event, "$event");
    },
    async fetchProjectList() {
      if (!this.projectData) {
        let data = await (await fetch("/api/projectstatus/Open")).json();
        this.projectData = data.filter(el => el.length > 6).sort();
      }
    }
  },
  components: {
    // eslint-disable-next-line vue/no-unused-components
    chooseProject,
    // eslint-disable-next-line vue/no-unused-components
    chooseProjectNumber
  },
};
</script>

<style lang="scss" scoped></style>
