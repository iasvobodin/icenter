<template>
  <div class="scaner">
    <h1>Шкафы</h1>
    <div class="qr__holder">
      <input
        v-model="state.search"
        class="choose"
        type="text"
        placeholder="wo или название шкафа"
      />
      <img
        class="qr__icon"
        src="/img/qr-code.svg"
        alt=""
        @click="changeView = !changeView"
      />
    </div>
    <div v-show="!changeView" class="scanner__holder">
      <img class="frame" src="/img/scanner.svg" alt="" />
      <video
        ref="streamVideo"
        class="video__stream"
        playsinline="true"
        autoplay="true"
      ></video>
      <canvas
        v-show="false"
        id="canvas"
        ref="vCanvas"
        height="auto"
        width="100%"
      ></canvas>
    </div>
    <br />
    <div
      v-for="(val, key, index) in state.actualRojects"
      v-show="state.groupCabinets(val).length != 0"
      :key="index"
    >
      <h2 class="group__items">Проект {{ val }}</h2>
      <br />
      <div class="errors__holder">
        <div
          v-for="(v, k, i) in state.groupCabinets(val)"
          :key="i"
          class="error__card__holder"
        >
          <div class="item__card" @click="$router.push(`/cabinets/${v.wo}`)">
            WO {{ v.wo }}
            <br />
            {{ v['cab name'] }} <br />
          </div>
        </div>
      </div>
      <br />
      <!-- <hr> -->
      <br />
    </div>
  </div>
</template>
<script setup>
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
} from 'vue'
import { useRouter } from 'vue-router'
// export default {
//     components: {
//     // chooseProjectNumber,
//   },
// setup() {
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
  cabinets: null,
  filter: null,
  groupCabinets: null,
  actualRojects: null,
  search: '',
})
watch(qr, (newValue, oldValue) => {
  router.push(`/cabinets/${newValue}`)
})

const routeToCabinet = (wo, val) => {
  router.push(`/cabinets/${wo}`)
  // const currentProject = state.projects.find(c => c.id === val)
  // const curretCabinet = currentProject.cabinets.find(cabinet => cabinet.wo === wo)
  // const payload = {
  //   "project number": currentProject.id,
  //   ...currentProject.info.base,
  //   ...currentProject.info.extends,
  //   ...curretCabinet
  //   }
  //   store.commit('SETcurrentProject',payload)
  // console.log(payload);
  // console.log(state.projects.find(c => c.id === val));
}

const getCabinets = async () => {
  const { request, response } = useFetch('/api/projects?status=open')
  await request()
  state.projects = response.value.filter((pr) =>
    ['01', '02', '03', '04'].some((s) =>
      pr.info.extends['status project'].includes(s)
    )
  )
  state.actualRojects = state.projects.map((p) => p.id)
  state.cabinets = state.projects
    .map((c) =>
      c.cabinets.map((cc) => {
        return {
          ...cc,
          project: c.id,
        }
      })
    )
    .flat()
  state.groupCabinets = (project) =>
    filter.value.filter((c) => c.project === project)
}
getCabinets()
const filter = computed(() => {
  return state.search
    ? state.cabinets.filter((e) =>
        [e?.wo, e?.['cab name']].some(
          (s) => s && s.toLowerCase().includes(state.search.toLowerCase())
        )
      )
    : state.cabinets
})
onUnmounted(() => {
  clearInterval(tick.value)
  vCanvas.value = null
  stream.value = null
})
onMounted(async () => {
  // const canvasElement = document.getElementById("canvas");
  const canvas = vCanvas.value.getContext('2d')

  try {
    stream.value = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: 'environment',
        width: {
          min: 640,
          max: 1024,
        },
        height: {
          min: 480,
          max: 768,
        },
      },
    })
  } catch (err) {
    console.log(err.name + ': ' + err.message)
  }

  const video = streamVideo.value
  video.srcObject = stream.value

  // if (!changeView.value) {
    
  tick.value = setInterval(() => {
    if (video.readyState === video.HAVE_ENOUGH_DATA &&!changeView.value) {
      vCanvas.value.height = video.videoHeight
      vCanvas.value.width = video.videoWidth
      canvas.drawImage(video, 0, 0, vCanvas.value.width, vCanvas.value.height)
      const imageData = canvas.getImageData(
        0,
        0,
        vCanvas.value.width,
        vCanvas.value.height
      )
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      })
      code && (qr.value = code.data)
    }
  }, 500)
  // }

})

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
  width: 30px;
  height: 30px;
  cursor: pointer;
  place-self: start;
  align-self: start;
  margin-top: 5px;
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
