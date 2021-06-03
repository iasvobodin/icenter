<template>
<br>
<br>
<br>
<h1>{{qr}}</h1>
<br>
<br>

<!-- <div id="loadingMessage" hidden="">⌛ Loading video...</div> -->
<!-- <video playsinline="true" style="width: 250px" autoplay="true" ref="streamVideo" ></video>
<canvas ref="canva" ></canvas>
<button @click="scan">SCAN</button> -->
<canvas id="canvas" height="auto" width="100%"></canvas>
  <!-- <video id="qr-video" playsinline="" disablepictureinpicture="" style="transform: scaleX(-1);"></video>
  <button @click="scanner.start()">SCAN</button> -->
  <!-- <div id="reader" style="width: 500px"></div> -->
  <!-- <QRcodeScanner/> -->
</template>
<script>
// import QRcodeScanner from '@/components/QRcodeScanner.vue'
import jsQR from "jsqr";
export default {
    components: {
    // QRcodeScanner
  },
  data() {
    return {
      qr: '',
      scanner: null
    }
  },
  methods: {
    scan(canvas, video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    }
  },
  watch: {
    qr() {
      window.location.href = this.qr
    }
  },
  async mounted () {
    
    const video = document.createElement("video");
    const canvasElement = document.getElementById("canvas");
    const canvas = canvasElement.getContext("2d");

    function drawLine(begin, end, color) {
      canvas.beginPath();
      canvas.moveTo(begin.x, begin.y);
      canvas.lineTo(end.x, end.y);
      canvas.lineWidth = 4;
      canvas.strokeStyle = color;
      canvas.stroke();
    }

    // Use facingMode: environment to attemt to get the front camera on phones
    // let stream = null

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: "environment"
    }
  })
      video.srcObject = stream;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.play();

    const tick = () => {
      // loadingMessage.innerText = "⌛ Loading video..."
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        // loadingMessage.hidden = true;
        // canvasElement.hidden = false;
        // outputContainer.hidden = false;

        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        if (code) {
          drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#ff5100");
          drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#ff5100");
          drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#ff5100");
          drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#ff5100");
          this.qr = code.data
        //  return
        //   console.log(code.data);
        } else {
          // outputMessage.hidden = false;
          // outputData.parentElement.hidden = true;
        }
      }
      requestAnimationFrame(tick);
    }
      requestAnimationFrame(tick);

  },
};
</script>

<style lang="css" scoped>
#canvas{
  display: block;
  width: min(600px, 95vw);
  margin: auto;
  color: #ff5100;
}
</style>
