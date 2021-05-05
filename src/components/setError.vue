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
        type="file"
        accept="image/*"
        @input="checkFile"
      />
      <div v-if="files">
        <p v-for="f in files" :key="f.lastModified">{{ f.name }}</p>
      </div>
      <br /><br />
      <input class="add__button" type="submit" value="Добавить" />
    </form>
    <br />

    <br />

    <br />
    <br />
    <button @click="statusConfirmed = !statusConfirmed">
      Подтвердить ошибку
    </button>
    <button v-if="statusConfirmed" @click="statusClosed = !statusClosed">
      Закрыть ошибку
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import Notiflix from 'notiflix'
import conditionalRender from '@/components/conditionalRender.vue'
interface IForm extends HTMLElement{
  files: []
}
export default defineComponent({
  components: {
    conditionalRender,
  },
  data() {
    return {
      fileInput: {} as IForm,
      files: [],
      errorTemplate: null,
      errorBody: { Открыто: {}, Принято: {}, Устранено: {} },
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
  methods: {
    checkFile() {
      this.fileInput = document.getElementById('imageFile') as IForm
      this.files = Object.values(this.fileInput.files)
    },
    returnRender(key: string) {
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
    async postError(e : HTMLFormElement) {
      // console.log(typeof e, "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      
      const id = 'error__' + Date.now()
      const link = 'https://icaenter.blob.core.windows.net/errors-photo/'
      const error = {
        id,
        info: {
          Проект: this.$store.state.projectInfo['project number'],
          Шкаф: this.$store.state.projectInfo['cab name'],
          wo: this.$store.state.projectInfo.wo.toString(),
          Добавил: sessionStorage.getItem('userDetails')!.toLowerCase(),
          Мастер: this.$store.state.projectInfo['senior fitter'].toLowerCase(),
        },
        photos: [],
        type: this.role,
        status: Object.values(this.errorBody.Устранено)[0]
          ? 'closed'
          : Object.values(this.errorBody.Принято)[0]
          ? 'confirmed'
          : 'open',
        ttl: 6000,
        body: [
          {
            ...this.errorBody,
            _changed: sessionStorage.getItem('userDetails')!.toLowerCase(),
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
        ttl: 6000,
      }
      // const fileField = document.querySelector('input[type="file"]');

      // formData.append("photo", this.files.files[0]);
      // console.log(Array.isArray(error.photos) , error.photos);
      this.files &&
        this.files.forEach((e, i : number) => {
          const formData = new FormData()
          formData.append(`photo${i}`, e)
          error.photos.push({
            link: `${link}${id}__${sessionStorage
              .getItem('userDetails')!
              .toLowerCase()}__${e.name}`,
            thumb: `${link}thumb__${id}__${sessionStorage
              .getItem('userDetails')!
              .toLowerCase()}__${e.name}`,
          })
          ;(async () => {
            const blobResponse = await fetch(
              `/api/blob?fileName=${id}__${sessionStorage
                .getItem('userDetails')!
                .toLowerCase()}__${e.name}`,
              {
                method: 'POST',
                body: formData,
              },
            )
            if (blobResponse.ok) {
              // Notiflix.Notify.Success(`Файл ${e.name} успешно загружен`)
            } else {
              // Notiflix.Notify.Failure(`Ошибка, файл  ${e.name} не загружен`)
            }
          })()
        })

      try {
        await fetch('/api/POST_error', {
          method: 'POST', // или 'PUT'
          body: JSON.stringify({ ...error }),
        })
        await fetch('/api/POST_openError', {
          method: 'POST', // или 'PUT'
          body: JSON.stringify({ ...openError }),
        })
      } finally {
        e.target.reset()
        this.errorBody = { Открыто: {}, Принято: {}, Устранено: {} }
        this.files = null
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
})
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
