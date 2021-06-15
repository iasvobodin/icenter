<template>
  <div v-if="$store.state.template">
    <form id="postError" ref="form" name="postError" @submit.prevent="postError">
      <div
        v-if="$store.state.user.info.userRoles.includes('admin')"
        class="error__item"
      >
        <h4 class="error__item__title">Выберете роль</h4>
        <select v-model="role" form="postError" class="change__status error__item__desc">
          <option selected value="f_error">Сборщик</option>
          <option value="t_error">Тестировщик</option>
        </select>
      </div>
      <div
        v-for="(value, key, index) in $store.state.template.error[role]"
        :key="index"
      >
        <section v-if="returnRender(key)">
          <h3>Статус ошибки: {{ key }}</h3>
          <conditional-render v-model="errorBody[key]" form-id="postError" :data-render="value" />
        </section>
      </div>
      <br />
      <input
        id="imageFile"
        ref="fileInput"
        multiple
        name="imagefile[]"
        type="file"
        accept="image/*"
        @input="checkFile"
      />
      <div v-if="files" class="photo__gallery">
        <div v-for="(fs, i) in filesBlobSRC" :key="i" class="photo__holder">
          <img :ref="setItemRef" class="photo__image" :src="fs" alt="" @load="revoke(fs)">
          <img class="delete__icon" src="/img/delete.svg" alt="" @click="deletePhoto(i)">
        </div>
         <img class="add__photo" src="/img/add__image.svg" alt="" @click="firedFileInput">
        <!-- <p v-for="(f, i) in files" :key="f.lastModified">{{i+1}} {{ f.name }} {{f.status}}</p> -->
      </div>
      <br />
      <br>
      <input :disabled="$store.state.loader" class="add__button" type="submit" value="Добавить" />
    </form>
  <br>
    <button @click="statusConfirmed = !statusConfirmed">
      Подтвердить ошибку
    </button>
    <button v-if="statusConfirmed" @click="statusClosed = !statusClosed">
      Закрыть ошибку
    </button>
  </div>
</template>

<script>
import conditionalRender from '@/components/conditionalRender.vue'
import {resizeImage} from "@/hooks/resizeImage";
const files = []
export default {
  components: {
    conditionalRender,
  },
  data() {
    return {
      filesBlobSRC:[],
      imageToUpload:[],
      filesSRC: [],
      resizeBlob:[],
      files: [],
      errorTemplate: null,
      errorBody: {
        Открыто: {},
        Принято: {},
        Устранено: {}
      },
      error: {},
      photo: null,
      role: 'f_error',
      statusConfirmed: false,
      statusClosed: false,
    }
  },
  created() {
    // !this.$store.state.template && this.$store.dispatch("GET_template");
  },
  mounted() {



if (!HTMLCanvasElement.prototype.toBlob) {
    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value: function(callback, type, quality) {

            var binStr = atob(this.toDataURL(type, quality).split(',')[1]),
                len = binStr.length,
                arr = new Uint8Array(len);

            for (var i = 0; i < len; i++) {
                arr[i] = binStr.charCodeAt(i);
            }

            callback(new Blob([arr], {type: type || 'image/png'}));
        }
    });
}

window.URL = window.URL || window.webkitURL;

// Modified from https://stackoverflow.com/a/32490603, cc by-sa 3.0
// -2 = not jpeg, -1 = no data, 1..8 = orientations
function getExifOrientation(file, callback) {
    // Suggestion from http://code.flickr.net/2012/06/01/parsing-exif-client-side-using-javascript-2/:
    if (file.slice) {
        file = file.slice(0, 131072);
    } else if (file.webkitSlice) {
        file = file.webkitSlice(0, 131072);
    }

    var reader = new FileReader();
    reader.onload = function(e) {
        var view = new DataView(e.target.result);
        if (view.getUint16(0, false) != 0xFFD8) {
            callback(-2);
            return;
        }
        var length = view.byteLength, offset = 2;
        while (offset < length) {
            var marker = view.getUint16(offset, false);
            offset += 2;
            if (marker == 0xFFE1) {
                if (view.getUint32(offset += 2, false) != 0x45786966) {
                    callback(-1);
                    return;
                }
                var little = view.getUint16(offset += 6, false) == 0x4949;
                offset += view.getUint32(offset + 4, little);
                var tags = view.getUint16(offset, little);
                offset += 2;
                for (var i = 0; i < tags; i++)
                    if (view.getUint16(offset + (i * 12), little) == 0x0112) {
                        callback(view.getUint16(offset + (i * 12) + 8, little));
                        return;
                    }
            }
            else if ((marker & 0xFF00) != 0xFF00) break;
            else offset += view.getUint16(offset, false);
        }
        callback(-1);
    };
    reader.readAsArrayBuffer(file);
}

// Derived from https://stackoverflow.com/a/40867559, cc by-sa
function imgToCanvasWithOrientation(img, rawWidth, rawHeight, orientation) {
    var canvas = document.createElement('canvas');
    if (orientation > 4) {
        canvas.width = rawHeight;
        canvas.height = rawWidth;
    } else {
        canvas.width = rawWidth;
        canvas.height = rawHeight;
    }

    if (orientation > 1) {
        console.log("EXIF orientation = " + orientation + ", rotating picture");
    }

    var ctx = canvas.getContext('2d');
    switch (orientation) {
        case 2: ctx.transform(-1, 0, 0, 1, rawWidth, 0); break;
        case 3: ctx.transform(-1, 0, 0, -1, rawWidth, rawHeight); break;
        case 4: ctx.transform(1, 0, 0, -1, 0, rawHeight); break;
        case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
        case 6: ctx.transform(0, 1, -1, 0, rawHeight, 0); break;
        case 7: ctx.transform(0, -1, -1, 0, rawHeight, rawWidth); break;
        case 8: ctx.transform(0, -1, 1, 0, 0, rawWidth); break;
    }
    ctx.drawImage(img, 0, 0, rawWidth, rawHeight);
    return canvas;
}

function reduceFileSize(file, acceptFileSize, maxWidth, maxHeight, quality, callback) {
    if (file.size <= acceptFileSize) {
        callback(file);
        return;
    }
    var img = new Image();
    img.onerror = function() {
        URL.revokeObjectURL(this.src);
        callback(file);
    };
    img.onload = function() {
        URL.revokeObjectURL(this.src);
        getExifOrientation(file, function(orientation) {
            var w = img.width, h = img.height;
            var scale = (orientation > 4 ?
                Math.min(maxHeight / w, maxWidth / h, 1) :
                Math.min(maxWidth / w, maxHeight / h, 1));
            h = Math.round(h * scale);
            w = Math.round(w * scale);

            var canvas = imgToCanvasWithOrientation(img, w, h, orientation);
            canvas.toBlob(function(blob) {
                console.log("Resized image to " + w + "x" + h + ", " + (blob.size >> 10) + "kB");
                callback(blob);
            }, 'image/jpeg', quality);
        });
    };
    img.src = URL.createObjectURL(file);
}









    console.log(resizeImage);
  },
  methods: {
        setItemRef(el) {
      // if (el) {
       this.imageToUpload.length === 0 && this.imageToUpload.push(el)
      // }
    },
    revoke(fs){
      console.log('blob is revoked');
      window.URL.revokeObjectURL(fs)
    },
    deletePhoto(i){
      this.files.splice(i, 1)
      this.filesSRC.splice(i, 1)
      console.log(this.filesSRC,this.files);
    },
    firedFileInput(){
      this.$refs.fileInput.click()
    },
   async resizeImageBeforeUpload(){

// const config = {
//     file: this.files[0],
//     maxSize: 500
// };
// const resizedImage = await resizeImage(config)
// console.log("upload resized image")






//      const dataURLToBlob = (dataURL) => {
//     const BASE64_MARKER = ';base64,';
//     if (dataURL.indexOf(BASE64_MARKER) == -1) {
//         const parts = dataURL.split(',');
//         const contentType = parts[0].split(':')[1];
//         const raw = parts[1];

//         return new Blob([raw], {type: contentType});
//     }

//     const parts = dataURL.split(BASE64_MARKER);
//     const contentType = parts[0].split(':')[1];
//     const raw = window.atob(parts[1]);
//     const rawLength = raw.length;

//     const uInt8Array = new Uint8Array(rawLength);

//     for (const i = 0; i < rawLength; ++i) {
//         uInt8Array[i] = raw.charCodeAt(i);
//     }

//     return new Blob([uInt8Array], {type: contentType});
// }
//     // Read in file
//     var file = event.target.files[0];

//     // Ensure it's an image
//     if(file.type.match(/image.*/)) {
//         console.log('An image has been loaded');

//         // Load the image
//        const reader = new FileReader();
//         reader.onload = function (readerEvent) {
//            const image = new Image();
//             image.onload = function (imageEvent) {

//                 // Resize the image
//                const canvas = document.createElement('canvas');
//                    let max_size = 544,// TODO : pull max size from a site config
//                     width = image.width,
//                     height = image.height;
//                 if (width > height) {
//                     if (width > max_size) {
//                         height *= max_size / width;
//                         width = max_size;
//                     }
//                 } else {
//                     if (height > max_size) {
//                         width *= max_size / height;
//                         height = max_size;
//                     }
//                 }
//                 canvas.width = width;
//                 canvas.height = height;
//                 canvas.getContext('2d').drawImage(image, 0, 0, width, height);
//                const dataUrl = canvas.toDataURL('image/jpeg');
//                const resizedImage = dataURLToBlob(dataUrl);
//                 // $.event.trigger({
//                 //     type: "imageResized",
//                 //     blob: resizedImage,
//                 //     url: dataUrl
//                 // });
//             }
//             image.src = readerEvent.target.result;
//         }
//         reader.readAsDataURL(file);
//     }
    },
   async checkFile() {

     Object.values(this.$refs.fileInput.files).forEach(f => {
       !this.files.some(file => f.name === file.name) && this.files.push(f)
     })
    //  this.imageToUpload = []
     console.log(this.files);

     this.files.forEach(file => {
       const newBlobUrl = URL.createObjectURL(file);
       const reader = new FileReader();
       reader.onload = e => !this.filesSRC.some(file => e.target.result === file) && this.filesSRC.push(e.target.result) && this.filesBlobSRC.push(newBlobUrl)
       reader.readAsDataURL(file);
       // this.filesBlobSRC.push(newBlobUrl)
       // console.log(newBlobUrl,'newBlobUrl');

       const image = new Image();
       image.src = newBlobUrl
       image.onerror = () => {
         URL.revokeObjectURL(newBlobUrl);
       };
       image.onload = () => {
         URL.revokeObjectURL(newBlobUrl)

         // Resize the image
         const canvas = document.createElement('canvas');
         let max_size = 2024, // TODO : pull max size from a site config
           width = image.width,
           height = image.height;
         if (width > height) {
           if (width > max_size) {
             height *= max_size / width;
             width = max_size;
           }
         } else {
           if (height > max_size) {
             width *= max_size / height;
             height = max_size;
           }
         }
         canvas.width = width;
         canvas.height = height;
         canvas.getContext('2d').drawImage(image, 0, 0, width, height);
         canvas.toBlob(b => {
           console.log(b, 'after resize')
           this.resizeBlob.push(b)
         }, 'image/jpeg', 90)
       }
     })

     addEventListener("beforeunload", this.beforeUnloadListener, {
       capture: true
     });

     // const config = {
     //     file: this.files[0],
     //     maxSize: 500
     // };
     // const resizedImage = await resizeImage(config)
     // console.log("upload resized image", resizedImage, this.files[0])

   },
    beforeUnloadListener(event) {
      event.preventDefault();
      return event.returnValue = "Are you sure you want to exit?";
    },
    returnRender(key) {
      if (key === 'Открыто') {
        return true
      }
      if (key === 'Принято' && this.statusConfirmed) {
        return true
      }
      if (key === 'Устранено' && this.statusClosed && this.statusConfirmed) {
        return true
      }
    },
    async postError(e) {
const f = document.getElementById('postError')
console.log(f);
const formData = new FormData(f)
console.log(formData);
return







this.$store.commit("changeLoader", true)

      const id = 'error__' + Date.now()
      const link = 'https://icaenter.blob.core.windows.net/errors-photo/'
      //create global object in db
      const error = {
        id,
        info: {
          Проект: this.$store.state.projectInfo['project number'],
          Шкаф: this.$store.state.projectInfo['cab name'],
          wo: this.$store.state.projectInfo.wo.toString(),
          Добавил: this.$store.state.user.info.userDetails.toLowerCase(),
          Мастер: this.$store.state.projectInfo['senior fitter'].toLowerCase(),
        },
        photos: [],
        type: this.role,
        status: Object.values(this.errorBody.Устранено)[0] ?
          'closed' : Object.values(this.errorBody.Принято)[0] ?
          'confirmed' : 'open',
        body: [{
          ...this.errorBody,
          _changed: this.$store.state.user.info.userDetails.toLowerCase(),
          _time: `${Date.now()}`,
        }, ],
      }
      const openError = {
        id,
        info: {
          ...error.info,
          Описание: this.errorBody.Открыто['Описание'],
        },
        type: error.type,
        status: error.status,
      }
      try {
        await Promise.all(this.resizeBlob &&
          this.resizeBlob.map(async (e, i) => {
            // debugger
            const formData = new FormData()
            formData.append(`photo${i}`, e, `${i}.jpg`)
            const imageName = `${id}__${this.$store.state.user.info.userDetails.toLowerCase()}__${i}`
            // const postImage = async () => {
              const blobResponse = 
              await fetch(
                `/api/blob?fileName=${imageName}`, {
                  method: 'POST',
                  body: formData,
                  keepalive: true,
                },
              )
              console.log(blobResponse);
              // if (blobResponse.ok) {
              //   e = {
              //     ...e,
              //     status: 'ok',
              //   }
              //   // Notiflix.Notify.Success(`Файл ${e.name} успешно загружен`)
              // } else {
              //   // Notiflix.Notify.Failure(`Ошибка, файл  ${e.name} не загружен`)
              // }
            // }

          }))
        await fetch('/api/POST_error', {
          method: 'POST', // или 'PUT'
          body: JSON.stringify({
            ...error
          }),
        })
        await fetch('/api/POST_openError', {
          method: 'POST', // или 'PUT'
          body: JSON.stringify({
            ...openError
          }),
        })
      } finally {
        e.target.reset()
        removeEventListener("beforeunload", this.beforeUnloadListener, {
          capture: true
        });
        this.errorBody = {
          Открыто: {},
          Принято: {},
          Устранено: {}
        }
        this.files = []
        this.$store.commit("changeLoader", false)
      }
      // await fetch(
      //   `/api/blob?folder=${this.error.id}&fileName=${this.error.id}`,
      //   {
      //     method: "POST",
      //     body: formData,
      //   }
      // );
    },
  },

  // async mounted() {
  //   try {
  //     if (!this.errorTemplate) {
  //       this.errorTemplate = await (
  //         await fetch("/api/templates/templateProject/ver1")
  //       ).json();
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
}
</script>


<style lang="css" scoped>
.add__photo{
  width: 100px;
  height: 100px;
  place-self: center;
  cursor: pointer;
}
.photo__image{
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
