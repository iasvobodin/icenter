<template>
    <div class="scanner__holder">
        <img class="frame" src="/img/scanner.svg" alt="scanner" />
        <video ref="streamVideo" class="video__stream" playsinline="true" autoplay="true"></video>
        <canvas v-show="false" id="canvas" ref="vCanvas" height="auto" width="100%"></canvas>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from '@vue/runtime-core'
import jsQR from 'jsqr'
const emit = defineEmits({
    scannedWo: null
})
const state = reactive({
    stream: <MediaStream>{},

    tick: <NodeJS.Timer>{},
    //   vCanvas: <HTMLCanvasElement>{},
    qr: '',
})
// ref<InstanceType<typeof MyModal>>
const vCanvas = ref<HTMLCanvasElement>()
const streamVideo = ref<HTMLVideoElement>()

onMounted(async () => {
    const canvas = vCanvas.value!.getContext('2d')

    try {
        state.stream = await navigator.mediaDevices.getUserMedia({
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
        if (err instanceof Error) {
            console.log(err.name + ': ' + err.message)
        }
    }

    const video = streamVideo.value
    video!.srcObject = state.stream

    state.tick = setInterval(() => {
        if (video!.readyState === video!.HAVE_ENOUGH_DATA) {
            vCanvas.value!.height = video!.videoHeight
            vCanvas.value!.width = video!.videoWidth
            canvas!.drawImage(video!, 0, 0, vCanvas.value!.width, vCanvas.value!.height)
            const imageData = canvas!.getImageData(
                0,
                0,
                vCanvas.value!.width,
                vCanvas.value!.height
            )
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: 'dontInvert',
            })

            if (code) {
                state.qr = code.data
                emit('scannedWo', code.data)
            } //&& ()
        }
    }, 500)
})

onUnmounted(() => {
    clearInterval(state.tick);
})

</script>

<style scoped>
.frame {
    position: absolute;
    margin: auto;
    width: min(100vw - 10px, 400px);
    height: min(100vw - 10px, 400px);
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
    width: min(100vw - 10px, 400px);
    height: min(100vw - 10px, 400px);
    margin: 1vh auto;
    position: relative;
}
#canvas {
    display: block;
    width: min(600px, 95vw);
    margin: auto;
    color: #ff5100;
}
</style>
