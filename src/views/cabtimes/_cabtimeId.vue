<template>
  <div>
    <!-- <h1>BETTA VERSION</h1> -->
    <div>
      <h1 @click="$router.push(`/cabinets/${$route.params.cabtimeId}`)">
        WO {{ $route.params.cabtimeId }}
      </h1>
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
    <button v-if="state.changeCabTime" @click="postCabTime">Save</button>
    <button v-if="state.changeCabTime" @click="deleteCabTime">Delete</button>
    <br />
    <br />
  </div>
</template>

<script setup>
import CabTimeView from '@/components/CabTimeView.vue'
import { useFetch } from '@/hooks/fetch'
import { useStore } from 'vuex'
import { computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const store = useStore()
const state = reactive({
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

const photosFromEmit = []

const photo = async () => {
  if (state.cabTime.blobFiles?.length > 0) {
    // !state.cabTime.photos && (state.cabTime.photos = [])
    const formData = new FormData()
    state.cabTime.blobFiles?.forEach((e, i) => {
      const unic = Date.now()
      const imageName = `${
        state.cabTime.id
      }__${store.state.user.info.userDetails.toLowerCase()}__${unic + i}.jpg`

      // state.cabTime.photos
      photosFromEmit.push(imageName)

      formData.set(`photo${unic + i}`, e, imageName)
    })

    // UPLOAD PHOTOS
    const { request, response } = useFetch(
      '/api/blob?container=cabtime-photo&test=true',
      {
        method: 'POST',
        body: formData,
      }
    )
    await request()
  }
}

const postCabTime = async () => {
  if (state.cabTime.delPH?.length > 0) {
    await Promise.all(
      state.cabTime.delPH.map(async (e) => {
        await fetch(e)
      })
    )
  }

  await photo()

  state.cabTime.photos = [...state.cabTime.photos, ...photosFromEmit]
  state.cabTime.delPH = null
  state.cabTime.blobFiles = null

  const { request } = useFetch('/api/post_item', {
    method: 'POST', // или 'PUT'
    body: JSON.stringify({
      ...state.cabTime,
    }),
  })
  await request()

  state.cabTime.photos = null

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

  const { request } = useFetch('/api/post_item', {
    method: 'POST', // или 'PUT'
    body: JSON.stringify({
      ttl: 10,
      ...state.cabTime,
    }),
  })
  await request()
  router.back()
}
</script>

<style lang="css" scoped>
.add__button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  cursor: pointer;
}
</style>
