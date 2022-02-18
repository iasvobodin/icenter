<template>
  <div class="app__header">
    <navigation-panel />
    <img class="back__image" src="/img/back.svg" @click="$router.back()" />
    <div class="holder">
      <h4 v-if="!userInfo" class="checkAuth">Проверка авторизации</h4>
      <div v-else class="user" @click="$router.push('/user')">
        <img
          v-if="$store.state.user.body.photo"
          class="user-photo"
          :src="`https://icaenter.blob.core.windows.net/user-photo/thumb__${store.state.user.info.userDetails}`"
          alt="user"
        />
        <span v-else>{{ $store.state.user.body.name }}</span>
      </div>
      <div class="task">
        <button v-if="!storeUserTask" @click="state.popupOpened = true">Приступить к работе</button>
        <div v-if="storeUserTask">
          <task-card :user-task="storeUserTask" :minify-view="true" />
        </div>
      </div>
    </div>
  </div>
  <teleport to="body">
    <confirm-popup :opened="state.popupOpened" @closed="popupClosed" @confirm="popupConfirmed">
      <template #header>
        <h3>Выберите шкаф.</h3>
      </template>
      <template #select>
        <selectWO @selected-wo="emitAlteredWo" />
        <p class="message">{{ state.message }}</p>
      </template>
      <template #buttons>
        <!-- :disabled="!state.wo" -->
        <button disabled class="popup__cancel__button" @click="createTask">Запустить задачу</button>
        <button class="popup__confirm__button" @click="popupClosed">Отмена</button>
      </template>
    </confirm-popup>
  </teleport>
</template>

<script setup lang="ts">
import selectWO from '@/components/selectWO.vue'
import confirmPopup from '@/components/modal/cunfirmPopup.vue'
import { computed, onMounted, reactive } from 'vue'
import navigationPanel from '@/components/adminNavigation.vue'
import { useStore } from 'vuex'
import taskCard from '@/components/task/taskCard.vue'
import { useFetch } from '@/hooks/fetch'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()
const userInfo = computed(() => store.state.user.info)
const storeUserTask = computed(() => store.state.userTask)

const state = reactive({
  popupOpened: false,
  wo: false,
  message: 'По выбранному WO должен быть расчитан CabTime'
})

const projectInfoState = computed(() => store.state.projectInfo)
const userInfoState = computed(() => store.state.user)

let user;
const localUser = localStorage.getItem('user')
localUser && (user = JSON.parse(localUser))
//GET TASK
!store.state.userTask && user && store.dispatch('GET_userTask', user.info.userDetails.toLowerCase())
// console.log('appheader run');
let chosenwo: string;
async function emitAlteredWo(wo: string) {
  chosenwo = wo
  const { request: reqCabTime, response: resCabTime } = useFetch(
    `/api/getitembyid/cabtime__${wo}`
  )
  state.message = `Проверка CabTime для ${wo}`
  try {
    await reqCabTime()
    state.wo = true
    state.message = `CabTime для ${wo} расчитан, можно запускать задачу.`
  } catch (error) {
    state.message = `CabTime для ${wo} не расчитан, выберите другой WO.`
    state.wo = false
    console.log(error, "ERRROR");
  }

}
function popupClosed() {
  state.popupOpened = !state.popupOpened
  state.message = 'По выбранному WO должен быть расчитан CabTime'
}
async function popupConfirmed() {
  console.log();

}
async function createTask() {
  await store.dispatch('getCabinetsInfo', chosenwo)

  const id = `task__${Date.now()}`
  const options = {
    method: 'post',
    body: JSON.stringify({
      id,
      info: {
        user: userInfoState.value.info.userDetails.toLowerCase(),
        userId: userInfoState.value.info.userId,
        'project number': projectInfoState.value['project number'],
        'Шкаф': projectInfoState.value['cab name'],
        wo: projectInfoState.value.wo.toString(),
      },
      type: 'task',
      status: 'active',
      body: {
        timeStart: Date.now(),
        timeStartUTC: new Date(Date.now()).toISOString(),
        timeEnd: null,
        timePassed: null,
        completeTask: [],
      },
    }),
  }
  const { request: postNewTask, response } = useFetch('/api/post_item', options)
  await postNewTask()
  router.push(`/tasks/${id}`)
  state.popupOpened = !state.popupOpened

}
</script>
<style>
.dialog__custom {
  align-self: start;
}
</style>
<style lang="css" scoped>
.message {
  text-align: center;
}
.holder {
  height: inherit;
  display: grid;
  grid-auto-flow: column;
}
.task {
  width: fit-content;
  /* height: inherit; */
  align-self: center;
  justify-self: end;
  margin-right: 110px;
}
.task button {
  width: fit-content;
}
.user-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
a {
  text-decoration-line: none;
  color: #ffffff;
  text-decoration-color: rgb(255, 255, 255);
}

.app__header {
  position: fixed;
  top: 0px;
  height: 50px;
  width: 100%;
  background-color: #004481;
  box-shadow: inset 0px 2px 3px 0px rgb(0 0 0 / 40%),
    0px 1px 2px 0px rgb(255 255 255 / 20%);
  /* z-index: 3; */
  /* position: fixed;
    top: 0px; */
  /* position: absolute;
    top: 0; */
}

.user {
  overflow: hidden;
  position: relative;
  top: 5px;
  left: 5px;
  width: 40px;
  height: 40px;
  border: 3px solid white;
  border-radius: 50%;
  display: grid;
  cursor: pointer;
}
.checkAuth {
  line-height: 50px;
  color: white;
  font-weight: 300;
}
.user > span {
  place-self: center;
  color: white;
}

.back__image {
  position: absolute;
  top: 5px;
  right: 60px;
  width: 40px;
  /* border: 1px solid black; */
  border-radius: 4px;
  cursor: pointer;
}
</style>
