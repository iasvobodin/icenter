<template>
  <div>
    <!-- <h1>BETTA VERSION</h1> -->
    <teleport to="body">
      <confirm-popup :opened="state.popupOpened" @closed="popupClosed" @confirm="popupConfirmed">
        <template #header>
          <h3>Удалить cabTime?</h3>
        </template>
      </confirm-popup>
    </teleport>
    <div v-if="pInfo">
      <h2>
        <i>№ :</i>
        {{ pInfo['project number'] }}
      </h2>
      <h2>
        <i>Проект :</i>
        {{ pInfo['Project Name'] }}
      </h2>

      <h2>
        <i>Шкаф :</i>
        {{ pInfo['cab name'] }}
      </h2>
      <h2 class="wo__clicked" @click="$router.push(`/cabinets/${$route.params.cabtimeId}`)">
        <i>WO :</i>
        {{ $route.params.cabtimeId }}
      </h2>
    </div>
    <cab-time-view
      v-if="state.cabTime"
      :task-edit="state.taskEdit"
      :input-data="state.cabTime"
      :change-data="state.changeCabTime"
      :template-data="
        JSON.parse(JSON.stringify(store.state.template.CabTimeV3))
      "
      @final="em($event)"
    />
    <item-photo-uploader
      v-if="state.cabTime"
      :change-photos-flag="state.changeCabTime"
      container="cabtime-photo"
      :current-photos="state.cabTime.photos"
      :object-id="state.cabTime.id"
      :save-changes-photo="state.saveChanges"
      @updated-photos="updatePhotoCollection"
    />
    <!-- @resized-blob="addPhotos($event)"
    @delete-blob="delPhotos($event)"-->
    <router-link
      v-if="
        !state.cabTime && $store.state.user.info.userRoles.includes('admin')
      "
      to="/cabtimes/addnewcabtime"
    >
      <img class="add__button" src="/img/add.svg" alt="Добавить новый CabTime" />
    </router-link>
    <br />
    <br />
    <button
      v-if="state.cabTime && $store.state.user.info.userRoles.includes('admin')"
      @click="state.changeCabTime = !state.changeCabTime"
    >{{ state.changeCabTime ? 'Cancel' : 'Change' }}</button>
    <button v-if="state.changeCabTime" @click="postCabtime">Save</button>
    <button v-if="state.changeCabTime" @click="state.popupOpened = true">Delete</button>
    <br />
    <br />
  </div>
</template>

<script setup lang="ts">
import itemPhotoUploader from '@/components/itemPhotoUploader.vue'
import CabTimeView from '@/components/CabTimeView.vue'
import confirmPopup from '@/components/modal/cunfirmPopup.vue'
import { useFetch } from '@/hooks/fetch'
import { useStore } from 'vuex'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { cabtimeType, cabtimeBody } from '@/types/cabtimeTypes'
const store = useStore()
const state = reactive({
  mainEmitFromPhotos2: null,
  saveChanges: false,
  popupOpened: false,
  cabTime: <cabtimeType | null>null,
  changeCabTime: false,
  taskEdit: false,
  updatedPhotos: [] as Array<string>,
})
const route = useRoute()
const router = useRouter()

const setState = async () => {
  debugger
  await store.dispatch('getCabinetsInfo', route.params.cabtimeId)
  // await store.dispatch('GET_cabinetItems', route.params.cabtimeId)
}
setState()
const pInfo = computed(() =>
  store.state.projectInfo ? store.state.projectInfo : null
)
const getCabTime = async () => {
  const { request, response } = useFetch<cabtimeType>(
    `/api/getitembyid/cabtime__${route.params.cabtimeId}`
  )
  try {
    await request()






    state.cabTime = response.value!
  } catch (error) {
    console.log('cant get cabTime request')
  }
  // state.errors = response
  // state.projects = JSON.parse(JSON.stringify(state.errors))
}
getCabTime()


const em = (e: cabtimeType) => (state.cabTime = e)

const updatePhotoCollection = (e: Array<string>) => {
  state.updatedPhotos = e
}
const postCabtime = async () => {
  const photos = state.updatedPhotos
  const { request } = useFetch('/api/post_item', {
    method: 'POST', // или 'PUT'
    body: JSON.stringify({
      ...state.cabTime,
      body: state.cabTime!.body.filter((e) => e.value),
      photos,
    }),
  })
  await request()
  await store.dispatch('UPLOAD_PHOTOS', 'cabtime-photo')
  // await store.dispatch('DELETE_PHOTOS')

  await getCabTime()
  await store.dispatch('getCabinetsInfo', route.params.cabtimeId)
  await store.dispatch('GET_cabinetItems', route.params.cabtimeId)
  state.changeCabTime = !state.changeCabTime
}
const deleteCabTime = async () => {
  // state.cabTime.photos?.length > 0 &&
  //   (await Promise.all(
  //     state.cabTime.photos.map(async (e) => {
  //       await fetch(
  //         `/api/blob?container=cabtime-photo&fileName=${e}&delblob=true`
  //       )
  //     })
  //   ))

  if (state.cabTime!.photos!.length > 0) {
    store.commit('PreparePhotosToDelete', {
      photos: state.cabTime!.photos,
      container: 'cabtime-photo',
    })
    await store.dispatch('DELETE_PHOTOS')
  }

  const { request: deleteCabTimeReq } = useFetch('/api/post_item', {
    method: 'POST', // или 'PUT'
    body: JSON.stringify({
      ...state.cabTime,
      ttl: 10,
    }),
  })
  await deleteCabTimeReq()
  router.back()
}
const popupClosed = () => {
  state.popupOpened = false
}
const popupConfirmed = async () => {
  await deleteCabTime()
  state.popupOpened = false
  // state.popupOpened = false
}
</script>

<style lang="css" scoped>
.cancel {
  min-width: 100px;
  width: fit-content;
  border: 1px solid green;
}
.confirm {
  min-width: 100px;
  width: fit-content;
  border: 1px solid red;
}
h2 {
  margin: 1vh auto;
}
.add__button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  cursor: pointer;
}
button {
  margin-bottom: 2vh;
}
.wo__clicked {
  cursor: pointer;
}
.wo__clicked:hover {
  color: blueviolet;
}
h2 i {
  color: gray;
}
</style>
