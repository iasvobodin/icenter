<template>
  <div class="project__holder">
    <div class="project">
      <choose-project-number
        @input-project-event="fetchProjectList"
        @choose-project-number="choose"
        :fetchUrl="projectData"
        :zeroEnd="true"
      />
      <div v-if="woList">
        <h3>Информация по проекту</h3>
        <div
          v-for="(value, key, index) in woList[0]['info']"
          :key="index"
          class="project__info__row"
        >
          <span>{{ key }}</span>
          <span>{{ value }}</span>
        </div>
        <h3>Заполните поля</h3>
        <form @submit.prevent="postProject" class="project__info">
          <div v-if="!fetchTemplate" class="fetchHolder">Load</div>
          <div
            v-else
            v-for="(value, key, index) in fetchTemplate.template.base"
            :key="index"
            class="project__info__row"
          >
            <span>{{ key }}</span>
            <select required v-model="selected[key]">
              <option v-for="(fitter, index) in value" :key="index">
                {{ fitter }}
              </option>
            </select>
          </div>
          <div v-if="!fetchTemplate" class="fetchHolder">Load</div>
          <div
            v-else
            v-for="(value, key, index) in fetchTemplate.template.extend"
            :key="index"
            class="project__info__row"
          >
            <span>{{ key }}</span>
            <textarea v-model="selected[key]" cols="30" rows="3"></textarea>
          </div>
          <div class="cabinet__info">
            <h3>Выберете шкафные линии</h3>
            <choose-wo-number
              :multiple-permission="true"
              :cabinetList="mappingWO"
              @checked-wo="mapWO"
              v-if="woList"
            />
            <!-- <table v-if="woList" style="width: 100%">
              <colgroup>
                <col style="width: 20%" />
                <col style="width: 80%" />
              </colgroup>
              <tr style="border: solid 2px orange;">
                <th>WO</th>
                <th>Наименование</th>
                <th>Выбрать всё<input @click="checkAll" type="checkbox" /></th>
              </tr>
              <tr v-for="(value, key, index) in woList" :key="index">
                <td>{{ value.wo }}</td>
                <td class="tg-0lax">{{ value["cab name"] }}</td>
                <td class="tg-0lax">
                  <input
                    :ref="setItemRef"
                    type="checkbox"
                    :value="value"
                    v-model="checkedCabinetsNames"
                  />
                </td>
              </tr>
            </table> -->
          </div>
          <input class="add__button" type="submit" :value="fetchStatus" />
        </form>
      </div>
    </div>
    <!-- <project-info v-if="validateData" :cabinets="checkedCabinetsNames" :projectNumber="woList[0].project" :project="{...woList[0]['project info'], ...selected} " /> -->
  </div>
</template>

<script>
import chooseProjectNumber from "@/components/chooseProjectNumber";
import chooseWoNumber from "@/components/chooseWoNumber";
// import projectInfo from './projectInfo.vue';
export default {
  components: {
    chooseProjectNumber,
    chooseWoNumber
  },
  computed: {
    mappingWO() {
      return (
        this.woList &&
        this.woList.map(el => {
          return {
            wo: el.cabinet.wo,
            ["cab name"]: el.cabinet["cabinet name"]
          };
        })
      );
    }
  },
  data() {
    return {
      projectData: null,
      fetchStatus: "Отправить в базу данных",
      validateData: false,
      fetchTemplate: null,
      selected: {},
      checkbox: [],
      checkedCabinetsNames: [],
      spinnerClass: false,
      selectedProject: null,
      filterProjectList: null,
      woList: null,
      listIsActive: null,
      checkBoxAll: false
    };
  },
  async mounted() {
    try {
      if (!this.fetchTemplate) {
        this.fetchTemplate = await (
          await fetch("/api/templates/templateProject/ver1")
        ).json();
        this.selected = {
          ...this.fetchTemplate.template.base,
          ...this.fetchTemplate.template.extend
        };
      }
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    mapWO(e) {
      console.log(e);
      this.checkedCabinetsNames = Object.values(e)
        .filter(el => el.wo)
        .map(el => {
          return {
            wo: el.wo,
            ["cab name"]: el["cab name"]
          };
        });
    },
    async choose($event) {
      if (!$event) {
        this.woList = null;
        return;
      }
      this.woList = await (await fetch(`/api/cabinetList/${$event}`)).json();

      this.checkedCabinetsNames = [];
      this.selectedProject = $event;
    },
    async fetchProjectList() {
      if (!this.projectData) {
        this.projectData = await (
          await fetch("/api/projectstatus/Open")
        ).json();
        // // debugger
        // this.projectData = data//.filter(el => el.length > 6).sort();
        // console.log(this.projectData);
      }
    },
    checkAll() {
      this.checkBoxAll = !this.checkBoxAll;
      if (this.checkBoxAll) {
        this.checkbox.forEach(e => (e.checked = true));
        this.checkedCabinetsNames = this.woList;
      } else {
        this.checkbox.forEach(e => (e.checked = false));
        this.checkedCabinetsNames = [];
      }
    },
    setItemRef(el) {
      !this.checkbox && this.checkbox.push(el);
    },
    async postProject() {
      let modifyEl;
      if (this.selectedProject.endsWith(".0")) {
        modifyEl = this.selectedProject.slice(0, -2);
      } else {
        modifyEl = this.selectedProject;
      }
      await fetch("/api/POST_project", {
        method: "POST", // или 'PUT'
        body: JSON.stringify({
          id: modifyEl,
          status: "open",
          // ttl: 1,
          info: {
            base: this.woList[0]["info"],
            extends: this.selected
          },
          cabinets: this.checkedCabinetsNames
        })
      });
      this.fetchStatus = "Проект успешно добавлен";
    }
  }
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
</style>
