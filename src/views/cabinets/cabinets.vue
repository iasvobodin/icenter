<template>
  <div class="scaner">
    <div class="main__header">
      <h1>Шкафы</h1>
      <div class="qr__icon" @click="changeView = !changeView" />
    </div>
    <qr-scanner v-if="!changeView" @scanned-wo="scannedEmit"></qr-scanner>
    <!-- <div v-show="!changeView" class="scanner__holder">
      <img class="frame" src="/img/scanner.svg" />
      <video ref="streamVideo" class="video__stream" playsinline="true" autoplay="true"></video>
      <canvas v-show="false" id="canvas" ref="vCanvas" height="auto" width="100%"></canvas>
    </div>-->
  </div>
  <h2
    style="cursor: pointer"
    @click="state.additionalSearch = !state.additionalSearch"
  >Расширенный поиск {{ state.additionalSearch ? '&#9650;' : '&#9660;' }}</h2>
  <div class="filter__holder">
    <transition name="slide-fade">
      <div v-show="state.additionalSearch" class="additional__filter">
        <h3>Статус проекта</h3>
        <ul>
          <li v-for="(status, index) in state.actualStatus" :key="index">
            <input v-model="state.filterStatus" type="checkbox" :value="status" />
            {{ status }}
          </li>
        </ul>
        <!-- <h3>CabTime расчитан</h3>
        <ul>
          <li>
            <input v-model="state.hasCabTime" type="checkbox" /> CabTime
          </li>
        </ul>-->
        <h3>Поиск</h3>
        <input
          v-model="state.search"
          class="choose"
          type="text"
          placeholder="WO или название шкафа"
        />
      </div>
    </transition>
  </div>

  <br />
  <div
    v-for="(val, key, index) in state.actualProjects"
    v-show="groupCabinets(val).length != 0"
    :key="index"
  >
    <h2 class="group__items">Проект {{ val }}</h2>
    <br />
    <div class="errors__holder">
      <div v-for="(v, k, i) in groupCabinets(val)" :key="i" class="error__card__holder">
        <div class="item__card" @click="$router.push(`/cabinets/${v.info.wo}`)">
          WO {{ v.info.wo }}
          <br />
          {{ v.info['cab name'] }}
          <br />
          <!-- <p v-if="v.stats?.errors?.length > 0">Ошибок - {{ v.stats?.errors?.length }}</p> -->
          <br />
        </div>
      </div>
    </div>
    <br />
    <!-- <hr> -->
    <br />
  </div>
</template>
<script setup lang="ts">
import { useStore } from 'vuex'
import { useFetch } from '@/hooks/fetch'
import chooseProjectNumber from '@/components/chooseProjectNumber.vue'
import jsQR from 'jsqr'
import {
  reactive,
  ref,
  onMounted,
  toRefs,
  computed,
  onUnmounted,
  watch,
  watchEffect,
} from 'vue'
import { useRouter } from 'vue-router'
import qrScanner from '@/components/qrScanner.vue'
// export default {
//     components: {
//     // chooseProjectNumber,
//   },
// setup() {
type cabinets = {
  info: {
    "cab name": string
    id: string
    "project number": string
    status: string
    "status project": string
    wo: string
  }
}
const router = useRouter()
const store = useStore()
const streamVideo = ref(null)
const stream = ref(null)
const vCanvas = ref(null)
const tick = ref(null)
const changeView = ref(true)
const qr = ref('')
const state = reactive({
  projects: null,
  cabinets: <cabinets[] | null>null,
  filter: null,
  // groupCabinets: <cabinets[] | null>null,
  actualProjects: <Set<string> | null>null,
  search: '',
  actualStatus: <Array<string> | null>null,
  filterStatus: ['04-Сборка/Assembly'],
  hasCabTime: false,
  additionalSearch: false,
})
watch(qr, (newValue, oldValue) => {
  router.push(`/cabinets/${newValue}`)
})

// const routeToCabinet = (wo, val) => {
//   router.push(`/cabinets/${wo}`)
//   // const currentProject = state.projects.find(c => c.id === val)
//   // const curretCabinet = currentProject.cabinets.find(cabinet => cabinet.wo === wo)
//   // const payload = {
//   //   "project number": currentProject.id,
//   //   ...currentProject.info.base,
//   //   ...currentProject.info.extends,
//   //   ...curretCabinet
//   //   }
//   //   store.commit('SETcurrentProject',payload)
//   // console.log(payload);
//   // console.log(state.projects.find(c => c.id === val));
// }

// const postCabinets = async () => {
//   //getAllCabinet
//   const { request: reqProjects, response } = useFetch(
//     '/api/projects?status=open'
//   )
//   await reqProjects()

//   const projects = response.value //.filter((pr) => ['01', '02', '03', '04'].some((s) => pr.info.extends['status project'].includes(s) ) )
//   projects.map((c) =>
//     c.cabinets.map(async (cc) => {
//       const body = {
//         id: cc.wo,
//         status: 'open',
//         info: {
//           ...cc,
//           'project number': c.id,
//           'project name': c.info.base['Project Name'],
//           'project status': c.info.extends['status project'],
//         },
//         extend: {},
//         stats: {},
//       }
//       const { request: postCabinet } = useFetch('api/createCabinets', {
//         method: 'post',
//         body: JSON.stringify(body),
//       })
//       await postCabinet()
//     })
//   )
// }

// const someUpdate = async () => {
//   const { request: reqCabinets, response: resCabinets } =
//     useFetch(`/api/GET_cabinet`)
//   await reqCabinets()

//   // console.log(resCabinets.value);

//   const cabinets = resCabinets.value
//   console.log(cabinets, 'CABINETS')

//   cabinets.map(async (e) => {
//     const { request, response: cabError } = useFetch(
//       `/api/cabinetItems_copy?wo=${e.id}`
//     )
//     await request()
//     e.stats.errors = cabError.value
//     // console.log(e, 'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE')

//     if (e.stats.errors.length > 0) {
//       const { request: postCabinets } = useFetch(`/api/GET_cabinet?post=true`, {
//         method: 'post',
//         body: JSON.stringify(e),
//       })

//       await postCabinets()
//     }
//   })
// }

// someUpdate()

// const getCabinets2 = async () => {
//   const { request, response } = useFetch('/api/projects?status=open')
//   await request()
//   const projects = response.value

//   projects.map(project => {

//     const modCab = project.cabinets.map(async cabinet => {

//       //GET CABINET ITEMS
//       const { request, response: cabError } = useFetch(
//         `/api/cabinetItems_copy?wo=${cabinet.wo}`
//       )
//       await request()

//       const cabinetItems = response.value

//       return {
//         wo: cabinet.wo,
//         'cab name': cabinet['cab name'],
//         cabTime: cabinetItems.filter(e => e.type === 'cabtime').length,
//         errors: cabinetItems.filter(e => e.type.includes('error')).length
//       }

//     })

//     return //someph
//   })

// }




// const getCabinets = async () => {
//   const { request, response } = useFetch('/api/projects?status=open')
//   await request()
//   state.projects = response.value.filter((pr) =>
//     ['01', '02', '03', '04'].some((s) =>
//       pr.info.extends['status project'].includes(s)
//     )
//   )
//   state.actualProjects = state.projects.map((p) => p.id)
//   state.cabinets = state.projects
//     .map((c) =>
//       c.cabinets.map((cc) => {
//         return {
//           ...cc,
//           project: c.id,
//         }
//       })
//     )
//     .flat()
//   state.groupCabinets = (project) => filter.value.filter((c) => c.project === project)
// }
// getCabinets()
const getCabinets = async () => {
  const { request, response } = useFetch<cabinets[]>('/api/GET_cabinet')
  await request()
  state.cabinets = response.value!
  // if(store.state.cabinets.length ===0){
  //   await store.dispatch('GET_cabinets')
  // }
  // console.log(store.state.cabinets,'store.state.cabinets');
  // state.projects = JSON.parse(JSON.stringify(store.state.cabinets))

  state.actualProjects = state.cabinets!.reduce(
    (acc, p) => acc.add(p.info['project number']),
    new Set<string>()
  )
  state.actualStatus = [
    ...state.cabinets!.reduce(
      (acc, p) => acc.add(p.info['status project']),
      new Set<string>()
    ),
  ].sort()

  // state.cabinets = state.projects

  // state.groupCabinets = (project) =>
  //   filter.value.filter((c) => c.info['project number'] === project)
}

const groupCabinets = (project: string) => filter.value.filter((c) => c.info['project number'] === project)

watchEffect(async () => {
  if (store.state.cabinets.length === 0) {
    await store.dispatch('GET_cabinets')
  }
  // console.log(store.state.cabinets,'store.state.cabinets');
  state.cabinets = JSON.parse(JSON.stringify(store.state.cabinets))
  getCabinets()
})

const filter = computed(() => {
  let cc
  if (state.cabinets && state.filterStatus.length > 0) {
    cc = state.cabinets.filter((e) =>
      state.filterStatus.some((s) => e.info['status project'].includes(s))
    )
    if (state.hasCabTime) {
      // cc = cc.filter((f) => f.stats.cabTime)
    }
    // console.log(cc)
    // const cc = ff.filter(f => f.state.cabTime)
    if (state.search) {
      cc = cc.filter((e) =>
        [e?.info.wo, e?.info['cab name']].some(
          (s) => s && s.toLowerCase().includes(state.search.toLowerCase())
        )
      )
    }
    return cc
  }
  // if (state.search) {
  //   return state.cabinets.filter((e) =>
  //     [e?.info.wo, e?.info['cab name']].some(
  //       (s) => s && s.toLowerCase().includes(state.search.toLowerCase())
  //     )
  //   )
  // }
  return []
})
const scannedEmit = (e: string) => {
  router.push(`/cabinets/${e}`)
  // state.searchCabinet = e
  // emit('selectedWo', e)
}
// onUnmounted(() => {
//   clearInterval(tick.value)
//   vCanvas.value = null
//   stream.value = null
// })
// onMounted(async () => {
//   // const canvasElement = document.getElementById("canvas");
//   const canvas = vCanvas.value.getContext('2d')

//   try {
//     stream.value = await navigator.mediaDevices.getUserMedia({
//       audio: false,
//       video: {
//         facingMode: 'environment',
//         width: {
//           min: 640,
//           max: 1024,
//         },
//         height: {
//           min: 480,
//           max: 768,
//         },
//       },
//     })
//   } catch (err) {
//     console.log(err.name + ': ' + err.message)
//   }

//   const video = streamVideo.value
//   video.srcObject = stream.value

//   // if (!changeView.value) {

//   tick.value = setInterval(() => {
//     if (video.readyState === video.HAVE_ENOUGH_DATA && !changeView.value) {
//       vCanvas.value.height = video.videoHeight
//       vCanvas.value.width = video.videoWidth
//       canvas.drawImage(video, 0, 0, vCanvas.value.width, vCanvas.value.height)
//       const imageData = canvas.getImageData(
//         0,
//         0,
//         vCanvas.value.width,
//         vCanvas.value.height
//       )
//       const code = jsQR(imageData.data, imageData.width, imageData.height, {
//         inversionAttempts: 'dontInvert',
//       })
//       code && (qr.value = code.data)
//     }
//   }, 500)
//   // }
// })

//     return {
//       vCanvas,
//       changeView,
//       streamVideo,
//       qr,
//       filter,
//       ...toRefs(state)
//     }
//   },
// };
</script>

<style lang="css" scoped>
.filter__holder {
  overflow: hidden;
}
.slide-fade-enter-active {
  transition: opacity 1.3s;
}

.slide-fade-leave-active {
  /* transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0); */
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  /* transform: translateY(100%); */
  opacity: 1;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  /* transform: translateY(-100%); */
  opacity: 0;
}
.main__header {
  display: grid;
  grid-auto-flow: column;
  width: fit-content;
  margin: auto;
}
h1 {
  width: fit-content;
  display: block;
  /* margin: auto; */
}
.additional__filter {
  position: relative;
  width: fit-content;
  margin: auto;
}
.additional__filter ul {
  margin: 0;
  padding: 0;
}
.additional__filter ul li {
  text-align: start;
  list-style: none;
}
.additional__filter ul li input {
  width: 15px;
  height: 15px;
  min-width: 15px;
  vertical-align: middle;
  margin-right: 1ch;
}
.project__number {
  position: sticky;
  top: 50px;
  background-color: white;
}
input {
  height: 30px;
  border: 1px solid orange;
  border-radius: 5px;
  min-width: 250px;
  line-height: 30px;
  font-size: 18px;
  text-align: center;
  margin: auto;
  padding: 0px;
}
.errors__holder {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(95vw, 300px), 1fr));
  align-items: stretch;
  /* grid-auto-flow: column dense; */
  grid-auto-columns: max(17vw, 250px);
  width: 95%;
  margin: auto;
  column-gap: 2vh;
  justify-content: center;
  row-gap: 2vh;
}

.item__card {
  /* border: 1px solid orange; */
  /* border-radius: 4px; */
  /* padding: 5px; */
  cursor: pointer;
  min-height: 50px;
  width: min(95vw, 300px);
}

.error__card__holder {
  place-self: center;
}
.qr__holder {
  height: 40px;
  display: grid;
  grid-auto-flow: column;
  column-gap: 10px;
  margin-top: 1vh;
  margin-bottom: 1vh;
  justify-content: center;
}
.qr__icon {
  display: inline-block;
  background-color: blue;
  mask: url(/img/qr-code.svg) no-repeat center / contain;
  -webkit-mask: url(/img/qr-code.svg) no-repeat center / contain;
  animation: pulse 5s infinite;
  width: 30px;
  height: 30px;
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
.choose {
  margin: 0;
  /* align-self: end; */
  justify-self: end;
  align-self: center;
}
.frame {
  position: absolute;
  width: min(500px, 95vw);
  height: min(500px, 95vw);
  color: #ff5100;
}
.video__stream {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
.scanner__holder {
  border-radius: 5px;
  overflow: hidden;
  width: min(500px, 95vw);
  height: min(500px, 95vw);
  margin: auto;
  position: relative;
}
#canvas {
  display: block;
  width: min(600px, 95vw);
  margin: auto;
  color: #ff5100;
}
.item__card:hover {
  /* border: 1px solid black;
  background: rgba(245, 254, 255, 0.356); */
}
</style>
