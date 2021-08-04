<template>
  <div
    :class="{ border__project: listIsActive }"
    class="choose__project__holder"
  >
    <div class="input__holder">
      <input
      :disabled="dis"
        v-model="selectedProject"
        type="text"
        list="projetList"
        @focus="listIsActive = true"
        @blur="listIsActive = false"
        :placeholder="placeHolder"
      />
      <img
        v-if="selectedProject"
        @mousedown="clearState"
        src="/img/cancel.svg"
        alt=""
      />
    </div>
    <div v-if="dataToRender" v-show="listIsActive"  class="project_list_holder">
      <ul class="project_list">
        <li v-if="filterProject.length === 0" class="project_item">
 <p class="p__holder">Попробуйте ввести другое условие поиска</p>
        </li>
        <li
        v-else
          v-for="(project, index) in filterProject"
          :key="index"
          class="project_item"
          @mousedown="chooseProject(index)"
        >
          <p class="p__holder">{{project}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {
  toRefs,
  ref,
  computed,
  nextTick
} from 'vue'
import { useStore } from 'vuex'
export default {
  props: {
    dis:{
      type: Boolean,
      default: ()=> false
    },
    dataToRender: {
      type: Array,
      default: ()=> [1, 2],
    },
    placeHolder:{
      type: String,
      default: "Введите номер проекта"
    }
  },
//   emits: ["inputProjectEvent", "chooseProjectNumber"],
  setup(props, { emit }) {
    const store = useStore()
    const {
      dataToRender
    } = toRefs(props)
    const selectedProject = ref('')
    const listIsActive = ref(false)
    const clearState = () =>{
      selectedProject.value = ''
      emit('chooseProjectNumber', '')
    }
    function chooseProject(index) {
      selectedProject.value = filterProject.value[index]
      store.commit('SETprojectNumber', selectedProject.value)
      emit('chooseProjectNumber', selectedProject.value)
      listIsActive.value = false
    }
    const filterProject = computed(() => {
        return dataToRender.value.filter((el) =>
          el.toLowerCase().includes(selectedProject.value.toLowerCase())
        );
    })
    return {
      listIsActive,
      selectedProject,
      filterProject,
      chooseProject,
      clearState
    }
  },
}
</script>

<style lang="css" scoped>
.p__holder{
   white-space: pre-wrap;
  word-wrap: break-word;
  /* font-size: calc(14px); */
  /* min-height: inherit; */
  display: block;
  place-self: center;
  /* line-height: calc(18px); */
}
datalist {
  height: 30vh;
  max-height: 30vh;
}
.input__holder {
  position: relative;
  display: flex;
}
.input__holder > img {
  cursor: pointer;
  height: 12px;
  /* padding: 7px; */
  position: absolute;
  right: 9px;
  top: 9px;
}
p {
  margin: 0;
  /* display: flex;
  align-items: stretch; */
}
ul {
  margin: 0;
}
.border__project {
  padding: 5px;
  border: 1px solid orange;
  border-radius: 5px;
}
.choose__project__holder {
  margin: auto;
  width: min(95vw - 50px, 400px);
}
input {
  height: 30px;
  border: 1px solid orange;
  border-radius: 5px;
  line-height: 30px;
  font-size: 18px;
  text-align: center;
  width: 100%;
  margin: auto;
  padding: 0px;
}
span {
  padding-left: 5px;
  padding-right: 5px;
  line-height: 30px;
  /* display: inline-block; */
  /* width: 50%; */
}
.loading {
  background: url(/img/loading.gif) no-repeat right center;
}
.project__holder {
  width: min(1600px, 95vw);
  display: grid;
  margin: auto;
  grid-template-columns: minmax(300px, 50vw);
  justify-content: space-around;
  column-gap: 5vw;
}
.project_list_holder {
  margin-top: 10px;
  margin-bottom: 10px;
  /* cursor: pointer; */
  max-height: 70vh;
  overflow-y: scroll;
}
.project_list {
  display: list-item;
  padding: 0;
  height: inherit;
}
option {
  border-bottom: 1px solid black;
}
ul {
  border: 1px solid black;
  border-radius: 5px;
  border-bottom: 0px;
}
.project_item {
  min-height: 30px;
  font-size: 16px;
  /* line-height: 30px; */
  border-bottom: 1px solid black;
  /* border-radius: 2px;
  padding: 2px;
  margin: 2px; */
  list-style: none;
  cursor: pointer;
  display: grid;
  /* border: 1px solid rgb(112, 112, 112); */
}
.project_item:hover {
  background-color: rgba(55, 158, 255, 0.342);
}
.clear__state{
  height: 30px; 
  margin-left: 10px;
}
</style>
