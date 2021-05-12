<template>
  <div class="project__holder">
    <div class="project">
      <p v-if="projectList&&projectList.lastUpdate">
        SCO OrderList latest update : {{ formatDate( new Date(projectList.lastUpdate*1000)) }}
      </p>
      <br>
      <choose-project-number v-if="projectList"
        :data-to-render="projectList.data.sort(e => e.status).map(e => `${e['project number']}`)"
        @choose-project-number="choose" />
      <!-- <div v-if="pl">{{pl}}</div> -->
      <!-- <input type="text" v-model="search">
      <div>{{result}}</div> -->
      <div v-if="woList">
        <div v-if="woList.length != 0">
          <h3>Информация по проекту</h3>
          <div v-for="(value, key, index) in woList[0]['info']" :key="index" class="project__info__row">
            <span>{{ key }}</span>
            <span>{{ value }}</span>
          </div>
        </div>
        <div v-else> Данного проекта нет в базе LegendStats.</div>

        <h3>Заполните поля</h3>
        <form class="project__info" @submit.prevent="postProject">
          <div v-if="!$store.state.template" class="fetchHolder">Load</div>
          <div v-for="(val, key, index) in selectedProject[0]" :key="index" class="cabinet__info__item">
            <h3>{{ key }}:</h3>
            <p>{{ val }}</p>
          </div>
          <!-- <div
            v-for="(value, key, index) in $store.state.template.template.base"
            v-else
            :key="index"
            class="project__info__row"
          >
            <span>{{ key }}</span>
            <select v-model="selected[key]" required>
              <option v-for="(fitter, i) in value" :key="i">
                {{ fitter }}
              </option>
            </select>
          </div> -->
          <div v-if="!$store.state.template" class="fetchHolder">Load</div>
          <!-- ///// -->
          <conditional-render v-model="selected.extend" :data-render="$store.state.template.template.extend" />
          <!-- <div
            v-for="(value, key, index) in $store.state.template.template.extend"
            :key="index"
            class="project__info__row"
          >
            <span>{{ key }}</span>
            <textarea v-model="selected[key]" cols="30" rows="3"></textarea>
          </div> -->

          <div class="cabinet__info">
            <h3>Выберете шкафные линии</h3>
            <choose-wo-number v-if="woList" :multiple-permission="true" :cabinet-list="mappingWO" @checked-wo="mapWO" />
          </div>
          <input class="add__button" type="submit" value="submit" />
        </form>
      </div>
    </div>
    <!-- <project-info v-if="validateData" :cabinets="checkedCabinetsNames" :projectNumber="woList[0].project" :project="{...woList[0]['project info'], ...selected} " /> -->
  </div>
</template>

<script>
import chooseProjectNumber from "@/components/chooseProjectNumber.vue";
import chooseWoNumber from "@/components/chooseWoNumber.vue";
import conditionalRender from "@/components/conditionalRender.vue";
import {useFetch} from "@/hooks/fetch"
import { useStore } from 'vuex'
import {useProjects} from '@/hooks/projectlsit'
import searchByObject from '@/hooks/searchByObject'
import { computed, ref, reactive } from '@vue/runtime-core';
// import projectInfo from './projectInfo.vue';
export default {
  components: {
    chooseProjectNumber,
    chooseWoNumber,
    conditionalRender
  },
 setup() {
   const store = useStore()
   const projectList = ref(null)
   const selectedProject = ref(null)
   const fetchProjectList = async () => {
     projectList.value = (await useProjects()).projetList.value
   };
   fetchProjectList()

const selected = reactive({extend:{}})

 function formatDate(date) {
      return (
        date.getDate() +
        "/" +
        "0" +
        (date.getMonth() + 1) +
        "/" +
        date.getFullYear() //+
        //" " +
      //  date.getHours() +
      //  ":" +
     //   date.getMinutes()
      );
    };

   const woList = ref(null)

   async function choose(e) {
     if (!e) {
       woList.value = null;
       return;
     }
     const {
       request,
       response: wo
     } = useFetch(`/api/cabinetList/${e}`)
     await request();
     selectedProject.value = projectList.value.data.filter(p => p['project number'] === e)
     woList.value = wo.value;
     // this.checkedCabinetsNames = [];
     // this.selectedProject = $event;
   }
  //  const result = computed(() => {
  //    return projectList.value && (projectList.value.filter(e => ['status', 'project number'].some(el => e[el].includes(search.value)))) // e['project number'].includes(search.value))
  //  })

   return {
     projectList,
     choose,
     woList,
     formatDate,
     selected,
     selectedProject
   }
 },
//   data() {
//     return {
//       projectData: null,
//       fetchStatus: "Отправить в базу данных",
//       validateData: false,
//       fetchTemplate: null,
//       selected: {},
//       checkbox: [],
//       checkedCabinetsNames: [],
//       spinnerClass: false,
//       selectedProject: null,
//       filterProjectList: null,
//       woList: null,
//       listIsActive: null,
//       checkBoxAll: false,
//       lastUpdate: null,
//     };
//   },
//   computed: {
//     mappingWO() {
//       return (
//         this.woList &&
//         this.woList.map((el) => {
//           return {
//             wo: el.cabinet.wo,
//             ["cab name"]: el.cabinet["cabinet name"],
//           };
//         })
//       );
//     },
//   },
//   async mounted() {
//     // this.fetchProjectList()
//     try {
//       if (!this.fetchTemplate) {
//         this.fetchTemplate = await (
//           await fetch("/api/templates/templateProject/ver1")
//         ).json();
//         this.selected = {
//           ...this.fetchTemplate.template.base,
//           ...this.fetchTemplate.template.extend,
//         };
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   },
//   methods: {
//     // async runDataFactory() {
//     //   const uri =
//     //     "https://management.azure.com/subscriptions/33ffdf9c-5499-414c-b962-a4ce5553d7e1/resourceGroups/Masstrikov_ICenter/providers/Microsoft.DataFactory/factories/icenter/pipelines/icenter/createRun?api-version=2017-03-01-preview";
//     //   await fetch(uri, {
//     //     method: "POST",
//     //   });
//     // },
//     formatDate(date) {
//       return (
//         date.getDate() +
//         "/" +
//         "0" +
//         (date.getMonth() + 1) +
//         "/" +
//         date.getFullYear() +
//         " " +
//         date.getHours() +
//         ":" +
//         date.getMinutes()
//       );
//     },
//     mapWO(e) {
//       console.log(e);
//       this.checkedCabinetsNames = Object.values(e)
//         .filter((el) => el.wo)
//         .map((el) => {
//           return {
//             wo: el.wo,
//             ["cab name"]: el["cab name"],
//           };
//         });
//     },
//     async choose($event) {
//       if (!$event) {
//         this.woList = null;
//         return;
//       }
//       this.$store.commit("changeLoader", true)
//       this.woList = await (await fetch(`/api/cabinetList/${$event}`)).json();
// this.$store.commit("changeLoader", false)
//       this.checkedCabinetsNames = [];
//       this.selectedProject = $event;
//     },
//     async fetchProjectList() {
//       if (!this.projectData) {
//         // this.$store.commit("changeLoader", true)
//         // const {request, response: projectList} = useFetch('/api/projectstatus?excludestatus=Отгружено')
//         // // const projectDataRes = await fetch("/api/projectstatus?excludestatus=Отгружено");
//         // await request();
//         // console.log(projectList,"projectList");
//         // this.projectData = projectList.value.data;
//         // this.$store.commit("changeLoader", false)
//         // console.log(typeof projectData.lastUpdate,  this.formatDate(new Date(projectData.lastUpdate*1000)));
     
//         const projectL = await useProjects()
//          this.projectData = projectL.value.data;
//             this.lastUpdate = this.formatDate(
//           new Date(projectL.value.lastUpdate * 1000)
//         );
// //        const mapPl = projectL.value.map(e => e['project number'])
// // console.log(mapPl,'mapPl');
// //         return {projectL}
//         // this.projectData = await (
//         //   await fetch("/api/projectstatus/Open")
//         // ).json();
//         //  console.log(this.formatDate(this.projectData.lastUpdate));
//         // // debugger
//         // this.projectData = data//.filter(el => el.length > 6).sort();
//         // console.log(this.projectData);
//       }
//     },
//     checkAll() {
//       this.checkBoxAll = !this.checkBoxAll;
//       if (this.checkBoxAll) {
//         this.checkbox.forEach((e) => (e.checked = true));
//         this.checkedCabinetsNames = this.woList;
//       } else {
//         this.checkbox.forEach((e) => (e.checked = false));
//         this.checkedCabinetsNames = [];
//       }
//     },
//     setItemRef(el) {
//       !this.checkbox && this.checkbox.push(el);
//     },
//     async postProject() {
//       let modifyEl;
//       if (this.selectedProject.endsWith(".0")) {
//         modifyEl = this.selectedProject.slice(0, -2);
//       } else {
//         modifyEl = this.selectedProject;
//       }
//       await fetch("/api/POST_project", {
//         method: "POST", // или 'PUT'
//         body: JSON.stringify({
//           id: modifyEl,
//           status: "open",
//           // ttl: 1,
//           info: {
//             base: this.woList[0]["info"],
//             extends: this.selected,
//           },
//           cabinets: this.checkedCabinetsNames,
//         }),
//       });
//       this.fetchStatus = "Проект успешно добавлен";
//     },
//   },
};
</script>

<style lang="css" scoped>
.add__button {
  margin: auto;
  width: 50%;
  height: 30px;
  margin-top: 15px;
  margin-bottom: 15px;
  background-color: rgb(255, 164, 59);
}
table {
  border-collapse: collapse;
}
td,
th {
  border: 1px solid #999;
  padding: 0.5rem;
  font-size: 12px;
}
tbody tr:nth-child(odd) {
  background: #eee;
}
tbody tr:hover {
  background: yellow;
}
.project__info__row {
  border-bottom: solid 1px black;
  /* background: rgba(214, 214, 214, 0.459); */
  padding: 5px;
  display: grid;
  grid-template-columns: 1fr 2fr;
}
.project__info__row > span {
  justify-self: stretch;
  align-self: center;
  /* place-self: start; */
  text-align: start;
}
.project__holder {
  width: min(1200px, 95vw);
  display: grid;
  margin: auto;
  grid-template-columns: 1fr;
  justify-content: space-around;
  column-gap: 5vw;
}
.project__info {
  display: grid;
}

.cabinet__info {
  margin-top: 3vh;
}
.project_input {
  width: 100%;
  height: 35px;
  text-align: center;
}
.loading {
  background: url(/img/loading.gif) no-repeat right center;
}
.project_list_holder {
  /* cursor: pointer; */
  max-height: 40vh;
  overflow-y: scroll;
}
.project_list {
  display: list-item;
  padding: 0;
  height: inherit;
}
.project_item {
  border-radius: 2px;
  padding: 2px;
  margin: 2px;
  list-style: none;
  border-bottom: 1px solid rgb(112, 112, 112);
}
.project_item:hover {
  background-color: rgba(55, 158, 255, 0.658);
}
.cabinet__info__item {
  border-bottom: 1px solid black;
  padding: 5px;
  /* width: 100%; */
  display: grid;
  grid-template-columns: 1fr 4fr;
}
.cabinet__info__item > h3 {
  justify-self: start;
  align-self: center;
  text-align: start;
}
.cabinet__info__item > p {
  justify-self: end;
  text-align: end;
  align-self: center;
}
</style>
