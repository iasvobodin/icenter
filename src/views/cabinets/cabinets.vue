<template>
  <div class="scaner">
    <h1>Шкафы</h1>
    <div class="qr__holder">
      <input v-model="search" class="choose" type="text" placeholder="wo или название шкафа">
      <!-- <choose-project-number 
      v-if="cabinets"
        :dis="!changeView" 
        class="choose" 
        :data-to-render="ff.map(e =>e.wo + '   ' +e['cab name'])"
        place-holder="Название шкафа или WO"
        @choose-project-number="$router.push(`/cabinets/${$event.split('   ')[0]}`)" /> -->
      <img class="qr__icon" src="/img/qr-code.svg" alt="" @click="changeView = !changeView">
    </div>
    <div v-show="!changeView" class="scanner__holder">
      <img class="frame" src="/img/scanner.svg" alt="">
      <video ref="streamVideo" class="video__stream" playsinline="true" autoplay="true"></video>
      <canvas v-show="false" id="canvas" height="auto" width="100%"></canvas>
    </div>
    <br>
    <div v-for="(val, key, index) in actualRojects" :key="index">
      <h2>Проект {{val}}</h2>
      <br>
      <div  class="errors__holder">
      <div v-for="(v, k, i) in groupCabinets(val)" :key="i" class="error__card__holder">
        <div class="errors__card" @click="$router.push(`/cabinets/${v.wo}`)">
          WO {{v.wo  }}
          <br>
          {{v['cab name']}} <br>
        </div>
 </div>
      </div>
      <br>
      <hr>
      <br>
    </div>
  </div>


</template>
<script>
import { useFetch } from '@/hooks/fetch'
import chooseProjectNumber from "@/components/chooseProjectNumber.vue";
import jsQR from "jsqr";
import {
  reactive,
  ref,
  onMounted,
  toRefs,
  computed,
  watch
} from 'vue';
import {
  useRouter
} from 'vue-router'
export default {
    components: {
    chooseProjectNumber,
  },
  setup() {
    const router = useRouter()
    const streamVideo = ref(null)
    const changeView = ref(true)
    const qr = ref('')
    const state = reactive({
      projects: null,
      cabinets: null,
      filter:null,
      groupCabinets:null,
      actualRojects:null,
      search:""
    })
    watch(qr, (newValue, oldValue) => {
      router.push(`/cabinets/${newValue}`)
    })
    const getCabinets = async () => {
      let url = new URL('/api/projects', import.meta.env.DEV ? 'http://localhost:8080': 'https://thankful-pebble-012619610.azurestaticapps.net/');
      url.searchParams.set('status', 'open');
      const {
        request,
        response
      } = useFetch(url)
      await request()
      state.projects = response.value.filter(pr => ['01','02','03'].some(s => pr.info.extends['status project'].includes(s)))
      state.actualRojects = state.projects.map(p => p.id)
      state.cabinets = state.projects.map(c =>  c.cabinets.map(cc => {return {...cc, project: c.id}})).flat()
      state.groupCabinets = project => filter.value.filter(c => c.project === project )
    }
    getCabinets()
    const filter = computed(()=> {
      return state.search ? 
      state.cabinets.filter(e => [e?.wo, e?.['cab name']].some(s => s && s.toLowerCase().includes(state.search.toLowerCase()))) :
      state.cabinets
    }
    )
    onMounted(async () => {
      const canvasElement = document.getElementById("canvas");
      const canvas = canvasElement.getContext("2d");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: "environment"
        }
      })
      const video = streamVideo.value
      video.srcObject = stream
      const tick = setInterval(() => {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvasElement.height = video.videoHeight;
          canvasElement.width = video.videoWidth;
          canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
          const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });
          code  && (qr.value = code.data)
        }
      }, 500)
    })

    return {
      changeView,
      streamVideo,
      qr,
      filter,
      ...toRefs(state)
    }
  },
};
</script>

<style lang="css" scoped>
input {
  height: 30px;
  border: 1px solid orange;
  border-radius: 5px;
  line-height: 30px;
  font-size: 18px;
  text-align: center;
  margin: auto;
  padding: 0px;
}
.errors__holder {
  display: grid;
  align-items: stretch;
  width: 95%;
  margin: auto;
  grid-template-columns: repeat(auto-fill, minmax(max(20vw, 250px), 1fr));
  column-gap: 2vh;
  row-gap: 2vh;
}

.errors__card {
  border: 1px solid orange;
  border-radius: 4px;
  padding: 5px;
  cursor: pointer;
  min-height: 50px;
}

.error__card__holder {
  place-self: stretch;

}
.qr__holder{
  height: 40px;
  display: grid;
  grid-auto-flow: column;
  column-gap: 10px;
  margin-top: 1vh;
  margin-bottom: 1vh;
}
.qr__icon{
  width: 30px;
  height: 30px;
  cursor: pointer;
  place-self: start;
  align-self: start;
  margin-top: 5px;
}
.choose{
  margin: 0;
  /* align-self: end; */
  justify-self: end;
  align-self: center;
}
.frame{
  position: absolute;
  width: min(500px, 95vw);
  height: min(500px, 95vw);
  color: #ff5100;
}
.video__stream{
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
.scanner__holder{
  border-radius: 5px;
  overflow: hidden;
  width: min(500px, 95vw);
  height: min(500px, 95vw);
  margin: auto;
  position: relative;
}
#canvas{
  display: block;
  width: min(600px, 95vw);
  margin: auto;
  color: #ff5100;
}
.errors__card:hover {
  border: 1px solid black;
  background: rgba(245, 254, 255, 0.356);
}
</style>
