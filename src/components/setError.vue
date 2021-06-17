<template>
  <div v-if="$store.state.template">
    <form id="postError" name="postError" @submit.prevent="postError">
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
        v-show="false"
      />
      <!-- <div v-child="canvas" v-if="canvas"></div> -->
      <div v-if="files" class="photo__gallery">
        <div  v-for="(fs, i) in files.c" :key="i" class="photo__holder">
          <div class="canvas__holder" v-child="fs" v-if="fs"></div>
          <img class="delete__icon" src="/img/delete.svg" alt="" @click="deletePhoto(i)">
        </div>
         <img class="add__photo" src="/img/add__image.svg" alt="" @click="firedFileInput">
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
import * as imageConversion from 'image-conversion';
import {
  resizeImage
} from "@/hooks/resizeImage";
// const files = []
export default {
  //   Vue.directive("child", {
  // 	bind(el, binding, vnode) {
  // 		el.appendChild(binding.value);
  // 	}
  // }),
  directives: {
    child: {
      // определение директивы
      mounted(el, binding, vnode) {
        binding.value.classList.add("canvas__el");
        el.appendChild(binding.value);
      }
    }
  },
  components: {
    conditionalRender,
  },
  data() {
    return {
      canvas: null,
      filesBlobSRC: [],
      imageToUpload: [],
      filesSRC: [],
      resizeBlob: [],
      files: {
        f: [],
        c: []
      },
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
  mounted() {},
  methods: {
    setItemRef(el) {
      // if (el) {
      this.imageToUpload.length === 0 && this.imageToUpload.push(el)
      // }
    },
    revoke(fs) {
      console.log('blob is revoked');
      window.URL.revokeObjectURL(fs)
    },
    deletePhoto(i) {
      this.files.f.splice(i, 1)
      this.filesSRC.splice(i, 1)
      // console.log(this.filesSRC, this.files);
    },
    firedFileInput() {
      this.$refs.fileInput.click()
    },
    async checkFile() {

      Object.values(this.$refs.fileInput.files).forEach(f => {
        !this.files.f.some(file => f.name === file.name) && this.files.f.push(f)
      })

      const view = async (f, i) => {
        const compressBlob = await imageConversion.compressAccurately(f, 500)
        const newBlobUrl = URL.createObjectURL(compressBlob);
        const img = await imageConversion.urltoImage(newBlobUrl)
        const canvas = await imageConversion.imagetoCanvas(img)
        canvas.style.width = '100%'
        canvas.style.height = '100%'
        canvas.style.objectFit = 'cover'
        canvas.style.objectPosition = 'center' //, ...canvas.style}
        this.files.c[i] = canvas
      }
      this.files.f.forEach((file, i) => {
        view(file, i)
      })
      addEventListener("beforeunload", this.beforeUnloadListener, {
        capture: true
      });
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
      // const f = document.getElementById('postError')
      // console.log(f);
      // const formData = new FormData(f)
      // console.log(formData);
      // return







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
            // const formData = new FormData()

            // formData.append(`photo${i}`, e, `${i}.jpg`)
            // console.log(formData);
            // debugger
            const imageName = `${id}__${this.$store.state.user.info.userDetails.toLowerCase()}__${i}.jpg`
            // const postImage = async () => {
            // const blobResponse = 
            await fetch(
              `/api/blob?fileName=${imageName}`, {
                method: 'POST',
                body: e,
                keepalive: true,
              },
            )
            // console.log(blobResponse);
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
        this.files.f = []
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
  display: block;
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
