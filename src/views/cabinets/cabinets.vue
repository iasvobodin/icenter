<template>
  <div class="scaner">
    <div class="qr__holder">
      <choose-project-number 
      :dis="!changeView"
        class="choose" 
        v-if="cabinets" 
        :data-to-render="ff.map(e =>e.wo + '   ' +e['cab name'])"
        place-holder="Название шкафа или WO"
        @choose-project-number="$router.push(`/cabinets/${$event.split('   ')[0]}`)" />
      <img @click="changeView = !changeView" class="qr__icon" src="/img/qr-code.svg" alt="">
    </div>
    <div v-show="!changeView" class="scanner__holder">
      <img class="frame" src="/img/scanner.svg" alt="">
      <video ref="streamVideo" class="video__stream" playsinline="true" autoplay="true"></video>
      <canvas v-show="false" id="canvas" height="auto" width="100%"></canvas>
    </div>
    <br>
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
      cabinets: null,
    })
    watch(qr, (newValue, oldValue) => {
      router.push(`/cabinets/${newValue}`)
    })
    const getCabinets = async () => {
      //  console.log(import.meta.env);
      let url = new URL('/api/projects', import.meta.env.DEV ? 'http://localhost:8080': 'https://thankful-pebble-012619610.azurestaticapps.net/');
      url.searchParams.set('status', 'open');
      const {
        request,
        response
      } = useFetch(url)
      await request()
      state.cabinets = response
       
    }
    getCabinets()
    const ff = computed(()=> state.cabinets.filter(pr => ['01','02','03'].some(s => pr.info.extends['status project'].includes(s))).map(c=> c.cabinets).flat())
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
      ff,
      ...toRefs(state)
    }
  },
};
</script>

<style lang="css" scoped>
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
</style>
