<template>
  <div v-if="$store.state.template">
    <form id="postError" @submit.prevent="postError">
      <div
        v-if="$store.state.user.info.userRoles.includes('admin')"
        class="error__item"
      >
        <h4 class="error__item__title">Выберете роль</h4>
        <select v-model="role" class="change__status error__item__desc">
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
          <conditional-render v-model="errorBody[key]" :data-render="value" />
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
      <div v-if="files">
        <img style="width:100px" v-for="(fs, is) in filesSRC" :key="is" :src="fs" alt="">
        <p v-for="(f, i) in files" :key="f.lastModified">{{i+1}}  {{ f.name }} {{f.status}}</p>
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
export default {
  components: {
    conditionalRender,
  },
  data() {
    return {
      filesSRC:[],
      files: new Set(),
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
    console.log(resizeImage);
  },
  methods: {
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
     Object.values(this.$refs.fileInput.files).forEach(f=>{
       if (this.files.length>0) {
         this.files.forEach(file =>{
           if (f.name === file.name ) {
             return
           } this.add.push(f)
         })
       } this.add.push(f)
        // this.files.add(f)
     })
    //  this.files = new Set([...this.files,...Object.values(this.$refs.fileInput.files)])
     // this.fileInput = document.getElementById('imageFile') 
      // this.files.add(...Object.values(this.$refs.fileInput.files))
      addEventListener("beforeunload", this.beforeUnloadListener, {
        capture: true
      });

  console.log(this.files);
this.files.forEach(file=>{
  // this.filesSRC =[]
const reader = new FileReader();
    reader.onload = e => this.filesSRC = new Set([...this.filesSRC,e.target.result]) ;
    reader.readAsDataURL(file);
})

    


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
this.$store.commit("changeLoader", true)
      const id = 'error__' + Date.now()
      const link = 'https://icaenter.blob.core.windows.net/errors-photo/'
      const error = {
        id,
        info: {
          Проект: this.$store.state.projectInfo['project number'],
          Шкаф: this.$store.state.projectInfo['cab name'],
          wo: this.$store.state.projectInfo.wo.toString(),
          Добавил: sessionStorage.getItem('userDetails').toLowerCase(),
          Мастер: this.$store.state.projectInfo['senior fitter'].toLowerCase(),
        },
        photos: [],
        type: this.role,
        status: Object.values(this.errorBody.Устранено)[0] ?
          'closed' : Object.values(this.errorBody.Принято)[0] ?
          'confirmed' : 'open',
        body: [{
          ...this.errorBody,
          _changed: sessionStorage.getItem('userDetails').toLowerCase(),
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
        await Promise.all(this.files &&
          this.files.map(async (e, i) => {
            const formData = new FormData()
            formData.append(`photo${i}`, e)
            const imageName = `${id}__${sessionStorage.getItem('userDetails').toLowerCase()}__${e.name}`
            const postImage = async () => {
              const blobResponse = await fetch(
                `/api/blob?fileName=${imageName}`, {
                  method: 'POST',
                  body: formData,
                  keepalive: true,
                },
              )
              if (blobResponse.ok) {
                e = {
                  ...e,
                  status: 'ok',
                }
                // Notiflix.Notify.Success(`Файл ${e.name} успешно загружен`)
              } else {
                // Notiflix.Notify.Failure(`Ошибка, файл  ${e.name} не загружен`)
              }
            }
            await postImage()
            error.photos.push(`${imageName}`)
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
        this.files = null
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
