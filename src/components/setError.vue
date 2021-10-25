<template>
  <div v-if="$store.state.template">
    <form id="postError" name="postError" @submit.prevent="postError">
      <div
        v-if="$store.state.user.info.userRoles.includes('admin')"
        class="error__item"
      >
        <h4 class="error__item__title">Выберете роль</h4>
        <select
          v-model="role"
          form="postError"
          class="change__status error__item__desc"
        >
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
          <!-- <conditional-render v-model="errorBody[key]" form-id="postError" :data-render="value" /> -->
          <div
            v-for="(v, k, i) in value"
            :key="i"
            class="error__item"
            :class="{ error__item__desc: k === 'Описание' }"
          >
            <h4
              :class="{ error__item__vertical__title: k === 'Описание' }"
              class="error__item__title"
            >
              {{ k }}
            </h4>
            <render-inputs v-model="errorBody[key]" :data-render="v" />
          </div>
          <div v-if="errorBody[key] && errorBody[key]['Ответственный']">
            <div class="error__item">
              <h4 class="error__item__title">
                {{ errorBody[key]['Ответственный'] }}
              </h4>
              <select
                v-model="errorBody[key]['Ошибку допустил']"
                required
                :name="key"
                :value="errorBody[key]['Ошибку допустил']"
                class="error__item__desc"
              >
                <option
                  v-for="(value2, key2, index2) in $store.state.template[
                    errorBody[key]['Ответственный']
                  ]"
                  :key="index2"
                >
                  {{ value2 }}
                </option>
              </select>
            </div>
          </div>
        </section>
      </div>
      <br />
      <error-photos
        :change-photos="true"
        container="errors-photo"
        @resized-blob="files.compressBlob = $event"
      />
      <br />
      <br />
      <br />
      <input
        :disabled="$store.state.loader"
        class="add__button"
        type="submit"
        value="Добавить ошибку"
      />
    </form>
    <br />
    <button
      v-if="$store.state.user.info.userRoles.includes('admin')"
      @click="statusConfirmed = !statusConfirmed"
    >
      Изменить статус на "Принято"
    </button>
    <br />
    <br />
    <button v-if="statusConfirmed" @click="statusClosed = !statusClosed">
      Изменить статус на "Устранено"
    </button>
    <br />
    <br />
  </div>
</template>

<script>
// import conditionalRender from '@/components/conditionalRender.vue'
import errorPhotos from '@/components/errorPhotos.vue'
import renderInputs from '@/components/renderInputs.js'
import * as imageConversion from 'image-conversion'
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
        binding.value.classList.add('canvas__el')
        el.appendChild(binding.value)
      },
    },
  },
  components: {
    // conditionalRender,
    errorPhotos,
    renderInputs,
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
        compressBlob: [],
        blobUrl: [],
      },
      errorTemplate: null,
      errorBody: {
        Открыто: {},
        Принято: {},
        Устранено: {},
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
    deletePhoto(i) {
      this.files.f.splice(i, 1)
      URL.revokeObjectURL(this.files.blobUrl[i])
      this.files.compressBlob.splice(i, 1)
      this.files.blobUrl.splice(i, 1)
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
          type: 'image/jpeg',
        })
        this.files.compressBlob[i] = compressBlob
        const newBlobUrl = URL.createObjectURL(compressBlob)
        this.files.blobUrl[i] = newBlobUrl

        // ON A FEATURE

        // const img = await imageConversion.urltoImage(newBlobUrl)
        // const canvas = await imageConversion.imagetoCanvas(img)
        // canvas.style.width = '100%'
        // canvas.style.height = '100%'
        // canvas.style.objectFit = 'cover'
        // canvas.style.objectPosition = 'center' //, ...canvas.style}
      }
      Object.values(this.$refs.fileInput.files).forEach((f) => {
        console.log(f)
        if (!this.files.f.some((file) => f.name === file.name)) {
          this.files.f.push(f)
          view(f, this.files.f.length - 1)
        }
      })

      addEventListener('beforeunload', this.beforeUnloadListener, {
        capture: true,
      })
    },
    beforeUnloadListener(event) {
      event.preventDefault()
      return (event.returnValue = 'Are you sure you want to exit?')
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
      this.$store.commit('changeLoader', true)

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
        status: Object.values(this.errorBody.Устранено)[0]
          ? 'closed'
          : Object.values(this.errorBody.Принято)[0]
          ? 'confirmed'
          : 'open',
        body: [
          {
            ...this.errorBody,
            _changed: this.$store.state.user.info.userDetails.toLowerCase(),
            _time: `${Date.now()}`,
          },
        ],
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
        const formData = new FormData()
        this.files.compressBlob.map((e, i) => {
          // const imageName = `${id}__${this.$store.state.user.info.userDetails.toLowerCase()}__${
          //   i + 1
          // }.jpg`

          const imageName = `${id}__${this.$store.state.user.info.userDetails.toLowerCase()}__${
            Date.now() + i
          }.jpg`

          error.photos.push(imageName)
          formData.set(`photo${i + 1}`, e, imageName)
        })
        // console.log(formData);
        await fetch('/api/blob?container=errors-photo&test=true', {
          method: 'POST',
          body: formData,
          // keepalive: true,
        })
        await fetch('/api/post_item', {
          method: 'POST', // или 'PUT'
          body: JSON.stringify({
            ...error,
          }),
        })
        if (error.status !== 'closed') {
          await fetch('/api/POST_openError', {
            method: 'POST', // или 'PUT'
            body: JSON.stringify({
              ...openError,
            }),
          })
        }
      } finally {
        e.target.reset()
        removeEventListener('beforeunload', this.beforeUnloadListener, {
          capture: true,
        })
        this.errorBody = {
          Открыто: {},
          Принято: {},
          Устранено: {},
        }
        this.files.f = []
        this.$router.push('/errors')
        this.$store.commit('changeLoader', false)
      }
      // await fetch(
      //   `/api/blob?container=errors-photo&folder=${this.error.id}&fileName=${this.error.id}`,
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
.canvas__holder {
  width: inherit;
  height: inherit;
}
.add__photo {
  width: 100px;
  height: 100px;
  place-self: center;
  cursor: pointer;
}
.canvas__el {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
.delete__icon {
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
  align-items: center;
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
input[type='submit'] {
  border: 1px solid green;
  background-color: rgba(0, 207, 0, 0.205);
}
input[type='number'] {
  height: 30px;
}
input[type='submit']:hover {
  background-color: rgb(0, 83, 0);
  color: white;
}
</style>
