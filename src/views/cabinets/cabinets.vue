<template>
<br>
<br>
<br>
<h1>{{qr}}</h1>
<br>
<br>

<!-- <div id="loadingMessage" hidden="">⌛ Loading video...</div> -->
<canvas id="canvas" height="480" width="640"></canvas>
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
  watch: {
    qr() {
      window.location.href = this.qr
    }
  },
  mounted () {
    
    var video = document.createElement("video");
    var canvasElement = document.getElementById("canvas");
    var canvas = canvasElement.getContext("2d");
    // var loadingMessage = document.getElementById("loadingMessage");
    var outputContainer = document.getElementById("output");
    var outputMessage = document.getElementById("outputMessage");
    var outputData = document.getElementById("outputData");

    function drawLine(begin, end, color) {
      canvas.beginPath();
      canvas.moveTo(begin.x, begin.y);
      canvas.lineTo(end.x, end.y);
      canvas.lineWidth = 4;
      canvas.strokeStyle = color;
      canvas.stroke();
    }

    // Use facingMode: environment to attemt to get the front camera on phones
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
      video.srcObject = stream;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.play();
      requestAnimationFrame(tick);
    });

    const tick = () => {
      // loadingMessage.innerText = "⌛ Loading video..."
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        // loadingMessage.hidden = true;
        // canvasElement.hidden = false;
        // outputContainer.hidden = false;

        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        var code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        if (code) {
          drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
          drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
          drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
          drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
          // outputMessage.hidden = true;
          // outputData.parentElement.hidden = false;
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
  },
};
</script>

<style lang="scss" scoped></style>
