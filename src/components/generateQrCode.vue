<template>
<div class="page">
    <h1 class="big__header">WO : {{generateData.wo}}</h1>
    <div class="qr__holder" ref="generate"></div>
    <h2 class="big__header">{{generateData['cab name']}}</h2>
    </div>
</template>

<script>
import QRCodeStyling from 'qr-code-styling';
export default {
    props: {
        generateData: {
            type: Object,
            required: true
        },
    },
    mounted() {
        this.generate();
    },
    methods: {
        generate() {
            const qrCode = new QRCodeStyling({
                "width": 500,
                "height": 500,
                "data":this.generateData.wo,
                "margin": 50,
                type: "canvas",
                image: "/img/logo.png",
                "qrOptions": {
                    typeNumber: 3,
                    "mode": "Byte",
                    "errorCorrectionLevel": "H"
                },
                "imageOptions": {
                    "imageSize": 0.4,
                    "margin": 0
                },
                "dotsOptions": {
                    "type": "classy-rounded",
                },
                "dotsOptionsHelper": {
                    "colorType": {
                        "single": true,
                        "gradient": false
                    },
                },
                "cornersSquareOptions": {
                    "type": "dot",
                },
                "cornersDotOptions": {
                    "type": "dot",
                },
            });
            qrCode.append(this.$refs.generate);
        }
    },
}
</script>

<style lang="css" scoped>
.qr__holder{
    height: 500px;
    /* overflow: hidden; */
}
/* svg{
    width: 70vh;
    height: 70vh;
    object-fit: cover;
    object-position: center;
} */
.big__header{
    /* height: calc((19cm - 500px)/2); */
    font-size: 50px;
    line-height: 55px;
    margin: 0;
    /* margin-top: 5vh;
    margin-bottom: 5vh; */
}
  .page{
      margin: 8vh;
    /* page-break-after:always; */
    /* width:29.7cm ;
  height:21cm ; */
  }
</style>