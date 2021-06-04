<template>
  <div class="scaner">
    <div class="scanner__holder">
      <svg class="frame" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="Guide"
        height="512" viewBox="0 0 512 512" width="512">
        <linearGradient id="linear-gradient" gradientUnits="userSpaceOnUse" x1="71.061" x2="71.061" y1="485"
          y2="120.122">
          <stop offset=".322" stop-color="#ff5100" />
          <!-- <stop offset=".466" stop-color="#b074ee" />
          <stop offset=".752" stop-color="#d8a1dd" /> -->
          <stop offset=".898" stop-color="gray" />
        </linearGradient>
        <linearGradient id="linear-gradient-2" x1="444.221" x2="444.221" xlink:href="#linear-gradient" y1="485"
          y2="120.122" />
        <linearGradient id="linear-gradient-3" x1="445.061" x2="445.061" xlink:href="#linear-gradient" y1="485"
          y2="120.122" />
        <linearGradient id="linear-gradient-4" x1="64.76" x2="64.76" xlink:href="#linear-gradient" y1="485"
          y2="120.122" />
        <linearGradient id="linear-gradient-5" x1="256" x2="256" xlink:href="#linear-gradient" y1="485" y2="120.122" />
        <path
          d="m16 125.186a6 6 0 0 0 6-6v-83.186a14.015 14.015 0 0 1 14-14h90.123a6 6 0 0 0 0-12h-90.123a26.03 26.03 0 0 0 -26 26v83.186a6 6 0 0 0 6 6z"
          fill="url(#linear-gradient)" />
        <path
          d="m496 382.025a6 6 0 0 0 -6 6v87.975a14.015 14.015 0 0 1 -14 14h-83.558a6 6 0 0 0 0 12h83.558a26.029 26.029 0 0 0 26-26v-87.975a6 6 0 0 0 -6-6z"
          fill="url(#linear-gradient-2)" />
        <path
          d="m476 10h-81.878a6 6 0 0 0 0 12h81.878a14.015 14.015 0 0 1 14 14v78.985a6 6 0 1 0 12 0v-78.985a26.03 26.03 0 0 0 -26-26z"
          fill="url(#linear-gradient-3)" />
        <path
          d="m113.521 490h-77.521a14.015 14.015 0 0 1 -14-14v-77.053a6 6 0 0 0 -12 0v77.053a26.029 26.029 0 0 0 26 26h77.521a6 6 0 0 0 0-12z"
          fill="url(#linear-gradient-4)" />
        <path
          d="m415.307 392.812v-273.623a26.029 26.029 0 0 0 -26-26h-266.614a26.029 26.029 0 0 0 -26 26v273.623a26.03 26.03 0 0 0 26 26h266.614a26.03 26.03 0 0 0 26-26zm-306.614 0v-273.623a14.015 14.015 0 0 1 14-14h266.614a14.015 14.015 0 0 1 14 14v273.623a14.016 14.016 0 0 1 -14 14h-266.614a14.016 14.016 0 0 1 -14-14z"
          fill="url(#linear-gradient-5)" />
      </svg>
      <video class="video__stream" ref="streamVideo" playsinline="true" autoplay="true"></video>
    </div>
  </div>
  <br>
  <button @click="$router.push(`/cabinets/${qr}`)" v-if="qr">Перейти к шкафу : WO{{qr}}</button>
  <canvas v-show="false" id="canvas" height="auto" width="100%"></canvas>
</template>
<script>
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
  watch: {
    // qr() {
    //   window.location.href = this.qr
    // }
  },
  async mounted () {
    
    // const video = document.createElement("video");
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
  const video2 = this.$refs.streamVideo
  video2.srcObject = stream
      // video.srcObject = stream;
      // video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      // video.play();

    const tick = setInterval( () => {
      if (video2.readyState === video2.HAVE_ENOUGH_DATA) {
        canvasElement.height = video2.videoHeight;
        canvasElement.width = video2.videoWidth;
        canvas.drawImage(video2, 0, 0, canvasElement.width, canvasElement.height);
        const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        if (code) {
          // drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#ff5100");
          // drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#ff5100");
          // drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#ff5100");
          // drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#ff5100");
          this.qr = code.data
        }
      }
    },500)
  },
  methods: {
    goToCabinet() {
     this.$router.push(`/cabinets/${this.qr}`)
    }
  },
};
</script>

<style lang="css" scoped>
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
