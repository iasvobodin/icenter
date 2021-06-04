<template>
    <h1 class="big__header">WO : {{generateData.wo}}</h1>
    <br>
    <div ref="generate"></div>
    <br>
    <h2 class="big__header">{{generateData['cab name']}}</h2>
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
                "margin": 20,
                image: "/img/logo.png",
                "qrOptions": {
                    "mode": "Byte",
                    "errorCorrectionLevel": "H"
                },
                "imageOptions": {
                    "imageSize": 0.7,
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
.big__header{
    font-size: 70px;
    line-height: 75px;
    margin: 0;
    margin-top: 10px;
    margin-bottom: 10px;
}
</style>