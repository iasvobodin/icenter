<template>
<h1>{{qr}}</h1>
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
  mounted () {
    
    var video = document.createElement("video");
    var canvasElement = document.getElementById("canvas");
    var canvas = canvasElement.getContext("2d");
    var loadingMessage = document.getElementById("loadingMessage");
    // var outputContainer = document.getElementById("output");
    // var outputMessage = document.getElementById("outputMessage");
    // var outputData = document.getElementById("outputData");

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

    function tick() {
      loadingMessage.innerText = "⌛ Loading video..."
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        loadingMessage.hidden = true;
        canvasElement.hidden = false;
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
          this.qr = code.data;
        } else {
          // outputMessage.hidden = false;
          // outputData.parentElement.hidden = true;
        }
      }
      requestAnimationFrame(tick);
    }
  
    function onScanSuccess(qrCodeMessage) {
      console.log(qrCodeMessage);
	// handle on success condition with the decoded message
}
    // const video = document.getElementById('qr-video');
    // // QrScanner.hasCamera().then();
    // this.scanner = new QrScanner(video, result => this.qr = result);
  //  const html5QrcodeScanner = new Html5QrcodeScanner(
	// "reader", { fps: 10, qrbox: 250 });

  // console.log(globalThis);

// html5QrcodeScanner.render(onScanSuccess);
  },
};
</script>

<style lang="scss" scoped></style>
