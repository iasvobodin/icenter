<template>
    <div>
        <input id="imageFile" ref="fileInput" multiple type="file" accept="image/*" @input="checkFile" v-show="false" />
        <div  class="photo__gallery">
            <div v-for="(url, i) in currentPhotos" :key="i" class="photo__holder">
                <a :href="`${linkPhoto}${url}`">
                    <img class="canvas__el" :src="`${linkPhoto}thumb__${url}`" alt="" />
                </a>
                <img class="delete__icon" src="/img/delete.svg" alt="" @click="deleteBlob(url,i)">
            </div>
            <div v-for="(url, i) in files.blobUrl" :key="i" class="photo__holder">
                <img class="canvas__el" :src="url" alt="ph">
                <img class="delete__icon" src="/img/delete.svg" alt="" @click="deletePhoto(i)">
            </div>
            <img v-if="changePhotos" class="add__photo" src="/img/add__image.svg" alt="" @click="firedFileInput">
        </div>
    </div>
</template>

<script>
import * as imageConversion from 'image-conversion';
export default {
    emits: ['deleteBlob', 'resizedBlob'],
    props: {
        currentPhotos: {
            type: Array,
            default: () => []
        },
        changePhotos:{
          type: Boolean,
          default: () => false
        }
    },
    created() {
        this.copyPhotos = this.currentPhotos;
    },
    data() {
        return {
            copyPhotos: [],
            deletMethods: [],
            linkPhoto: 'https://icaenter.blob.core.windows.net/errors-photo/',
            files: {
                f: [],
                compressBlob: [],
                blobUrl: []
            },
        }
    },
    methods: {
        deleteBlob(el, i) {
            // this.copyPhotos.splice(i, 1)
            this.deletMethods.push(`/api/blob?fileName=${el}&delblob=true`, `/api/blob?fileName=thumb__${el}&delblob=true`)
            this.$emit('deleteBlob', {del:this.deletMethods, index: i})
        },
        deletePhoto(i) {
            this.files.f.splice(i, 1)
            URL.revokeObjectURL(this.files.blobUrl[i])
            this.files.compressBlob.splice(i, 1)
            this.files.blobUrl.splice(i, 1)
            this.$emit('resizedBlob', this.files.compressBlob)
        },
        firedFileInput() {
            this.$refs.fileInput.click()
        },
        async checkFile() {
            const view = async (f, i) => {
                this.files.blobUrl[i] = '/img/Eclipse.gif'
                const compressBlob = await imageConversion.compressAccurately(f, {
                    size: 500,
                    accuracy: 0.9, //The compressed image size is 100kb
                    type: "image/jpeg",
                })
                this.files.compressBlob[i] = compressBlob
                const newBlobUrl = URL.createObjectURL(compressBlob);
                this.files.blobUrl[i] = newBlobUrl
            }
            await Promise.all(Object.values(this.$refs.fileInput.files).map(async f => {
                if (!this.files.f.some(file => f.name === file.name)) {
                    this.files.f.push(f)
                    await view(f, this.files.f.length - 1)
                }
            }))
            this.$emit('resizedBlob', this.files.compressBlob)
            addEventListener("beforeunload", this.beforeUnloadListener, {
                capture: true
            });
        },
        beforeUnloadListener(event) {
            event.preventDefault();
            return event.returnValue = "Are you sure you want to exit?";
        },
    },
}
</script>

<style lang="css" scoped>
.canvas__holder{
  width: inherit;
  height: inherit;
}
.add__photo{
  width: 100px;
  height: 100px;
  place-self: center;
  cursor: pointer;
}
.canvas__el{
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
.photo__gallery{
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  row-gap: 1vh;
  column-gap: 1vh;
}
.photo__holder{
  position: relative;
  width: 150px;
  height: 150px;
  overflow: hidden;
  border-radius: 4px;
  place-self: center;
}
.delete__icon{
  position: absolute;
  top: 5px;
  right: 5px;
  width: 35px;
  cursor: pointer;
}
.cabinet__info__item {
  border-bottom: 1px solid black;
  padding: 5px;
  /* width: 100%; */
  display: grid;
  grid-template-columns: 1fr 4fr;
}
.error__item {
  border-bottom: 1px solid black;
  padding: 2px;
  padding-top: 6px;
  padding-bottom: 6px;
  display: grid;
  grid-template-columns: 2fr 3fr;
}
.error__item__title {
  justify-self: start;
  align-self: center;
  text-align: start;
  margin: 0;
}
.error__field {
  margin: 10px;
  box-sizing: border-box;
}
form {
  width: min(95vw, 400px);
  margin: auto;
}
.error__item__desc {
  display: block;
  justify-self: end;
  text-align: end;
  align-self: center;
  margin: 0;
}
.error__item__vertical__title {
  text-align: center;
  margin: 5px;
}
</style>