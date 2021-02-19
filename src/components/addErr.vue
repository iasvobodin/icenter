<template>
  <h1>Добавить ошибку</h1>
  <div class="project">
    <h4>Выбранный проект №:{{ message }}</h4>
    <input
      @input="listIsActive = true"
      class="project_input"
      v-model="message"
      placeholder="Введите номер проекта"
    />
    <div v-if="listIsActive" class="project_list_holder">
      <ul class="project_list">
        <li
          v-for="(project, index) in filterList"
          :key="index"
          @click="chooseProject(index)"
          class="project_item"
        >
          {{ project }}
        </li>
      </ul>
    </div>
  </div>
  <div class="project">
    <ul class="project_list">
      <li class="project_item" v-for="(wo, index) in woList" :key="index">
        WO№ - {{ wo.id }} <br />
        Название шкафа - {{ wo.cabinetInfo.cabName }}
      </li>
    </ul>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { computed, ref, watch } from "vue";
export default {
  setup() {
    const message = ref(null);
    const listIsActive = ref(null);
    const filterList = ref(null);
    const woList = ref(null);
    let dataProject;
    (async function() {
      dataProject = await (await fetch(`/api/projectstatus/Open`)).json();
    })();
    const chooseProject = index => {
      listIsActive.value = false;
      message.value = filterList.value[index];
      let projectNumberQuery = message.value;
      if (!projectNumberQuery.includes(".")) {
        projectNumberQuery = projectNumberQuery + ".0";
      }
      (async function() {
        woList.value = await (
          await fetch(`/api/cabinetList/${projectNumberQuery}`)
        ).json();
      })();
    };
    watch(message, () => {
      filterList.value = dataProject.filter(el => el.includes(message.value));
    });
    // const filterList = computed(() =>
    //   dataProject.filter(el => el.includes(message.value))
    // );
    return { message, filterList, chooseProject, listIsActive, woList };
  }
};
</script>

<style lang="css" scoped>
.wo_right {
  text-align: right;
  width: 50%;
}
.wo_left {
  text-align: left;
  width: 50%;
}
.project_input {
  width: 100%;
  height: 25px;
  text-align: center;
}
.project {
  margin: auto;
  width: max(200px, 20vw);
}
.project_list_holder {
  cursor: pointer;
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
}
.project_item:hover {
  background-color: rgb(255, 191, 94);
}
</style>
