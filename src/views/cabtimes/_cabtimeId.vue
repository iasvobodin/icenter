<template>
  <div>
    <!-- <h1>BETTA VERSION</h1> -->
    <teleport to="body">
      <confirm-popup
        :opened="state.popupOpened"
        @closed="popupClosed"
        @confirm="popupConfirmed"
      >
        <h3>Удалить cabTime?</h3>
      </confirm-popup>
    </teleport>
    <div>
      <h2>
        Номер проекта
        {{ pInfo['project number'] }}
      </h2>
      <h2>
        Название проекта
        {{ pInfo['Project Name'] }}
      </h2>

      <h2>Название шкафа {{ pInfo['cab name'] }}</h2>
      <h2
        class="wo__clicked"
        @click="$router.push(`/cabinets/${$route.params.cabtimeId}`)"
      >
        WO {{ $route.params.cabtimeId }}
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
      @uploadChanges="mainEmitFromPhotos"
    />
    <!-- @resized-blob="addPhotos($event)"
      @delete-blob="delPhotos($event)" -->
    <router-link
      v-if="
        !state.cabTime && $store.state.user.info.userRoles.includes('admin')
      "
      to="/cabtimes/addnewcabtime"
    >
      <img
        class="add__button"
        src="/img/add.svg"
        alt="Добавить новый CabTime"
      />
    </router-link>
    <br />
    <br />
    <button
      v-if="state.cabTime && $store.state.user.info.userRoles.includes('admin')"
      @click="state.changeCabTime = !state.changeCabTime"
    >
      {{ state.changeCabTime ? 'Cancel' : 'Change' }}
    </button>
    <button v-if="state.changeCabTime" @click="state.saveChanges = true">
      Save
    </button>
    <button v-if="state.changeCabTime" @click="state.popupOpened = true">
      Delete
    </button>
    <br />
    <br />
  </div>
</template>

<script setup>
import itemPhotoUploader from '@/components/itemPhotoUploader.vue'
import CabTimeView from '@/components/CabTimeView.vue'
import confirmPopup from '@/components/modal/cunfirmPopup.vue'
import { useFetch } from '@/hooks/fetch'
import { useStore } from 'vuex'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const store = useStore()
const state = reactive({
  mainEmitFromPhotos2: null,
  saveChanges: false,
  popupOpened: false,
  cabTime: null,
  changeCabTime: false,
  taskEdit: false,
})
const route = useRoute()
const router = useRouter()

const setState = async () => {
  await store.dispatch('getCabinetsInfo', route.params.cabtimeId)
  await store.dispatch('GET_cabinetItems', route.params.cabtimeId)
}
setState()
const pInfo = computed(() =>
  store.state.projectInfo ? store.state.projectInfo : {}
)
const getCabTime = async () => {
  const { request, response } = useFetch(
    `/api/errors/cabtime__${route.params.cabtimeId}`
  )
  try {
    await request()
    state.cabTime = response
  } catch (error) {
    console.log('cant get cabTime request')
  }
  // state.errors = response
  // state.projects = JSON.parse(JSON.stringify(state.errors))
}
getCabTime()

// const computedItems = computed(
//   () => store.state.cabinetItems.filter((e) => e.type === 'cabtime')[0]
// )
const em = (e) => (state.cabTime = e)

// const photosFromEmit = []

// const photo = async () => {
//   if (state.cabTime.blobFiles?.length > 0) {
//     // !state.cabTime.photos && (state.cabTime.photos = [])
//     const formData = new FormData()
//     state.cabTime.blobFiles?.forEach((e, i) => {
//       const unic = Date.now()
//       const imageName = `${
//         state.cabTime.id
//       }__${store.state.user.info.userDetails.toLowerCase()}__${unic + i}.jpg`

//       // state.cabTime.photos
//       photosFromEmit.push(imageName)

//       formData.set(`photo${unic + i}`, e, imageName)
//     })

//     // UPLOAD PHOTOS
//     const { request, response } = useFetch(
//       '/api/blob?container=cabtime-photo&test=true',
//       {
//         method: 'POST',
//         body: formData,
//       }
//     )
//     await request()
//   }
// }
const mainEmitFromPhotos = async (e) => {
  state.cabTime.photos = await e
  postCabtime()
}

const postCabtime = async () => {
  const { request } = useFetch('/api/post_item', {
    method: 'POST', // или 'PUT'
    body: JSON.stringify({
      ...state.cabTime,
      body: state.cabTime.body.filter((e) => e.value),
    }),
  })
  await request()

  await getCabTime()
  await store.dispatch('getCabinetsInfo', route.params.cabtimeId)
  await store.dispatch('GET_cabinetItems', route.params.cabtimeId)
  state.changeCabTime = !state.changeCabTime
}
const deleteCabTime = async () => {
  state.cabTime.photos?.length > 0 &&
    (await Promise.all(
      state.cabTime.photos.map(async (e) => {
        await fetch(
          `/api/blob?container=cabtime-photo&fileName=${e}&delblob=true`
        )
      })
    ))

  const { request: deleteCabTimeReq } = useFetch('/api/post_item', {
    method: 'POST', // или 'PUT'
    body: JSON.stringify({
      ttl: 10,
      ...state.cabTime,
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
</style>
