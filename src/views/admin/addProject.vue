<template>
  <div>
    <h2>Добавление нового проекта в базу данных</h2>
    <!-- <chooseProjectNumber
 @input-project-event="fetchProjectList" 
 @choose-project-number="choose"
 :fetchUrl="projectData"
 /> -->
    <Suspense>
      <add-project-db />
    </Suspense>
  </div>
</template>

<script>
// import chooseCabinet from "../../components/chooseCabinet";
import addProjectDb from '@/components/addProjectDb.vue'
import chooseProjectNumber from '@/components/chooseProjectNumber.vue'
export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    addProjectDb,
    // eslint-disable-next-line vue/no-unused-components
    chooseProjectNumber,
  },
  data() {
    return {
      projectData: null,
    }
  },
  methods: {
    choose($event) {
      console.log($event, '$event')
    },
    async fetchProjectList() {
      if (!this.projectData) {
        let data = await (await fetch('/api/projectstatus/Open')).json()
        this.projectData = data.filter((el) => el.length > 6).sort()
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
