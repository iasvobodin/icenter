<template>
  <div>
    <h2>Добавление нового проекта в базу данных</h2>
    <!-- <chooseProjectNumber
 @input-project-event="fetchProjectList" 
 @choose-project-number="choose"
 :fetchUrl="projectData"
 /> -->
    <add-project-db />
  </div>
</template>

<script>
// import chooseCabinet from "../../components/chooseCabinet";
import addProjectDb from "@/components/addProjectDb";
import chooseProjectNumber from "@/components/chooseProjectNumber";
export default {
  data() {
    return {
      projectData: null,
    };
  },
  methods: {
    choose($event) {
      console.log($event, "$event");
    },
    async fetchProjectList() {
      if (!this.projectData) {
        let data = await (await fetch("/api/projectstatus/Open")).json();
        this.projectData = data.filter((el) => el.length > 6).sort();
      }
    },
  },
  components: {
    // eslint-disable-next-line vue/no-unused-components
    addProjectDb,
    // eslint-disable-next-line vue/no-unused-components
    chooseProjectNumber,
  },
};
</script>

<style lang="scss" scoped></style>
