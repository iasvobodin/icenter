<template>
  <div>
    <h2>Добавление новой ошибки.</h2>
    <choose-project-number :data-to-render="projectData" @input-project-event="fetchProjectList"
      @choose-project-number="choose" />
    <div v-if="projectInformation">
      <br>
      <choose-project-number placeHolder="Введите номер WO" :data-to-render="projectInformation.cabinets.map(e =>e.wo + '   ' +e['cab name'])"
        @choose-project-number="chooseCabinet" />
      <div v-if="cabinet">
        <set-error />
      </div>
    </div>
  </div>
</template>

<script>
import setError from "@/components/setError.vue";
import chooseProjectNumber from "@/components/chooseProjectNumber.vue";
export default {
  components: {
    setError,
    chooseProjectNumber,
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
  mounted () {
     this.fetchProjectList();

//      const beforeUnloadListener = (event) => {
//   event.preventDefault();
//   return event.returnValue = "Are you sure you want to exit?";
// };

//   addEventListener("beforeunload", beforeUnloadListener, {capture: true});
//   //     removeEventListener("beforeunload", beforeUnloadListener, {capture: true});
// const nameInput = document.querySelector("#name");

// nameInput.addEventListener("input", (event) => {
//   if (event.target.value !== "") {
//   } else {
//   }
// });
  },
  methods: {
    chooseCabinet(e) {
      this.cabinet = e.split('   ')[0];
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
          await fetch(`/api/projects?status=${this.projectStatus}`)
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
