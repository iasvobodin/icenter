<template>
  <!-- <div @click="state.projectListActive = false" class="overlay"></div> -->
  <div class="choose__project">
    <div
      v-if="!state.changeView"
      class="qr__icon"
      @click="state.changeView = !state.changeView"
    ></div>
    <div
      v-else
      class="edit__icon"
      @click="state.changeView = !state.changeView"
    ></div>

    <qr-scanner v-if="state.changeView" @scanned-wo="scannedEmit"></qr-scanner>
    <div v-if="!state.changeView" class="global__holder">
      <div style="z-index: 2" class="choose__project__holder">
        <div class="input__holder">
          <input
            v-model="state.searchProject"
            type="text"
            placeholder="Номер проекта"
            @focus="projectActive"
          />
          <div class="controls">
            <span class="small__controls" @click="projectActive">
              {{ state.projectListActive ? ' &#128070;' : '&#128071;' }}
            </span>
            <span class="small__controls" @click="state.searchProject = ''"
              >&#10060;</span
            >
          </div>
        </div>
        <div v-if="state.projectListActive" class="project_list_holder">
          <ul class="project_list">
            <li
              v-for="(project, index) in filterProject"
              :key="index"
              class="project_item"
              @mousedown="chooseProject(project)"
            >
              <p class="p__holder">{{ project }}</p>
            </li>
            <li v-if="filterProject.length === 0" class="project_item">
              <p class="p__holder">Нет совпадений!</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="choose__project__holder">
        <div class="input__holder">
          <input
            v-model="state.searchCabinet"
            type="text"
            placeholder="Номер WO"
            @focus="state.cabinetListActive = true"
          />
          <div class="controls">
            <span
              class="small__controls"
              @click="state.cabinetListActive = !state.cabinetListActive"
              >{{ state.cabinetListActive ? ' &#128070;' : '&#128071;' }}</span
            >
            <span class="small__controls" @click="state.searchCabinet = ''"
              >&#10060;</span
            >
          </div>
        </div>
        <div v-if="state.cabinetListActive" class="project_list_holder">
          <ul class="project_list">
            <li
              v-for="(cabinet, index) in filterCabinets"
              :key="index"
              class="project_item"
              @mousedown="chooseCabinet(cabinet.id)"
            >
              <p class="p__holder">
                {{ cabinet.id }}
                <br />
                <small>{{ cabinet.info['cab name'] }}</small>
              </p>
            </li>
            <li v-if="filterCabinets.length === 0" class="project_item">
              <p class="p__holder">Нет совпадений!</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import qrScanner from '@/components/qrScanner.vue'
import { computed, ComputedRef, reactive } from '@vue/reactivity'
import { ssrContextKey } from '@vue/runtime-core'
import { useStore } from 'vuex'

const emit = defineEmits({
  selectedWo: null,
})

const state = reactive({
  project: '',
  cabinet: '',
  searchProject: '',
  searchCabinet: '',
  projectListActive: false,
  cabinetListActive: false,
  changeView: true,
})
const store = useStore()
const cabinets = computed(() => store.state.cabinets)
const actualProjects = computed(
  () =>
    <string[]>[
      ...cabinets.value.reduce(
        (
          acc,
          p //Object.values(p.stats?.cabTime) &&
        ) => acc.add(p.info['project number']),
        new Set()
      ),
    ]
)
const filterProject = computed(() =>
  state.searchProject
    ? actualProjects.value.filter((el) =>
        el.toLowerCase().includes(state.searchProject.toLowerCase())
      )
    : actualProjects.value
)

const filterCabinets = computed(() =>
  state.searchCabinet
    ? store.state.cabinets
        .filter((el) =>
          filterProject.value.some((s) => el.info['project number'] === s)
        )
        .filter((f) =>
          [f.id, f.info['cab name']].some((ss) =>
            ss.includes(state.searchCabinet)
          )
        )
    : store.state.cabinets.filter((el) =>
        filterProject.value.some((s) => el.info['project number'] === s)
      )
)

async function checkStore() {
  if (store.state.cabinets.length === 0) {
    await store.dispatch('GET_cabinets')
  }
}
checkStore()

const scannedEmit = (e: string) => {
  state.searchCabinet = e
  emit('selectedWo', e)
}

const chooseProject = (e: string) => {
  state.searchCabinet = ''
  state.searchProject = e
  state.projectListActive = false
}
const chooseCabinet = (e: string) => {
  state.searchCabinet = e
  emit('selectedWo', e)
  state.cabinetListActive = false
}
const projectActive = () => {
  state.projectListActive = !state.projectListActive
  state.projectListActive && (state.cabinetListActive = false)
}
</script>
<style scoped>
.edit__icon {
  /* display: inline-block; */
  margin: auto;
  background-color: blue;
  mask: url(/img/edit.png) no-repeat center / contain;
  -webkit-mask: url(/img/edit.png) no-repeat center / contain;
  animation: pulse 5s infinite;
  width: 50px;
  height: 50px;
  cursor: pointer;
  place-self: center;
  /* align-self: start; */
  /* margin-top: 5px; */
}
.qr__icon {
  /* display: inline-block; */
  margin: auto;
  background-color: blue;
  mask: url(/img/qr-code.svg) no-repeat center / contain;
  -webkit-mask: url(/img/qr-code.svg) no-repeat center / contain;
  animation: pulse 5s infinite;
  width: 50px;
  height: 50px;
  cursor: pointer;
  place-self: center;
  /* align-self: start; */
  /* margin-top: 5px; */
}
@keyframes pulse {
  0% {
    /* transform: scale(0.9); */
    background-color: blue;
    /* box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7); */
  }

  50% {
    /* transform: scale(1.1); */
    background-color: orange;
    /* box-shadow: 0 0 0 10px rgba(0, 0, 0, 0); */
  }

  100% {
    /* transform: scale(0.9); */
    background-color: blue;
    /* box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); */
  }
}
.p__holder {
  white-space: pre-wrap;
  word-wrap: break-word;
  /* font-size: calc(14px); */
  /* min-height: inherit; */
  text-align: center;
  display: block;
  place-self: center;
  /* line-height: calc(18px); */
}

.input__holder > img {
  cursor: pointer;
  height: 12px;
  /* padding: 7px; */
  margin: auto;
  position: absolute;
  right: 9px;
  top: 9px;
}
p {
  margin: 0;
}
ul {
  margin: 0;
}
.choose__project {
  width: min(100vw - 10px, 400px);
}
.choose__project__holder {
  pointer-events: none;
  margin: 10px auto;
  width: 90%;
  height: 32px;
  position: relative;
}
.input__holder {
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 1fr auto;
  border: 1px solid orange;
  margin: auto;
  border-radius: 5px;
}

[type='text'] {
  pointer-events: all;
  height: 30px;
  border: 1px solid transparent;
  border-radius: 5px;
  line-height: 30px;
  font-size: 18px;
  text-align: center;
  width: 100%;
  display: inline-block;
  padding: 0px;
}
input:focus-visible {
  outline: transparent;
}
.controls {
  justify-self: end;
}
.small__controls {
  user-select: none;
  cursor: pointer;
  pointer-events: all;
  height: 30px;
  width: 30px;
  /* border: 1px solid orange; */
  display: inline-block;
  border-radius: 4px;
  padding: 0;
  text-align: center;
  /* margin-left: 10px; */
}
span {
  padding-left: 5px;
  padding-right: 5px;
  line-height: 30px;
}

.project_list_holder {
  background-color: white;
  pointer-events: all;
  margin: 10px 0;
  max-height: 40vh;
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
</style>
