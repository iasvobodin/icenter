<template>
    <div>
        <h1>Проекты</h1>
        <chooseProjectNumber @input-project-event="fetchProjectList" @choose-project-number="choose"
            :fetchUrl="projectData" />
        <!-- <projectList /> -->
    </div>
</template>

<script>
import chooseProjectNumber from "@/components/chooseProjectNumber";
import projectList from "../../components/projectList";
export default {
      data() {
    return {
      projectData: null,
      fetchProject: null,
      woList:null
    };
  },
  components: {
    // eslint-disable-next-line vue/no-unused-components
     projectList,  chooseProjectNumber
  },
    methods: {
    choose($event) {
     this.woList = Object.values(this.fetchProject).filter(e => e.id === $event)
    //   console.log(woList.cabinets);
    //   console.log($event, "$event");
    },
    async fetchProjectList() {
      if (!this.projectData) {
        this.fetchProject = await (await fetch(`/api/project/open`)).json();
        this.projectData = this.fetchProject.map(el => el.id);
      }
    }
  },
    setup () {
        

        return {}
    }
}
</script>

<style lang="css" scoped>

</style>