<template>
  <div v-if="$store.state.template">
    <form id="postError" name="postError" @submit.prevent="postError">
      <div v-if="$store.state.user.info.userRoles.includes('admin')" class="error__item">
        <h4 class="error__item__title">Выберете роль</h4>
        <select v-model="role" form="postError" class="change__status error__item__desc">
          <option selected value="f_error">Сборщик</option>
          <option value="t_error">Тестировщик</option>
        </select>
      </div>
      <div v-for="(value, key, index) in $store.state.template.error[role]" :key="index">
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
            >{{ k }}</h4>
            <render-inputs v-model="errorBody[key]" :data-render="v" />
          </div>
          <div v-if="errorBody[key] && errorBody[key]['Ответственный']">
            <div class="error__item">
              <h4 class="error__item__title">{{ errorBody[key]['Ответственный'] }}</h4>
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
                >{{ value2 }}</option>
              </select>
            </div>
          </div>
        </section>
      </div>
      <br />
      <item-photo-uploader
        :change-photos-flag="true"
        container="errors-photo"
        :object-id="id"
        :save-changes-photo="saveChanges"
        @updated-photos="updatePhotoCollection"
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
    >Изменить статус на "Принято"</button>
    <br />
    <br />
    <button
      v-if="statusConfirmed"
      @click="statusClosed = !statusClosed"
    >Изменить статус на "Устранено"</button>
    <br />
    <br />
  </div>
</template>

<script>
// import conditionalRender from '@/components/conditionalRender.vue'
import itemPhotoUploader from '@/components/itemPhotoUploader.vue'
import renderInputs from '@/components/renderInputs'
import * as imageConversion from 'image-conversion'
export default {
  components: {
    // conditionalRender,
    itemPhotoUploader,
    renderInputs,
  },
  data() {
    return {
      id: 'error__' + Date.now(),
      saveChanges: false,
      errorBody: {
        Открыто: {},
        Принято: {},
        Устранено: {},
      },
      error: {},
      role: 'f_error',
      statusConfirmed: false,
      statusClosed: false,
      photos: [],
    }
  },
  methods: {
    // async postForm(e) {
    //   // const ff =  new FormData(e.target)
    //   // // const ff = serializeForm(e.target)
    //   // console.log(Array.from(ff.entries()))
    //   // console.log(e);
    //   this.saveChanges = true
    // },
    // async mainEmitFromPhotos(e) {
    //   this.error.photos = await e
    //   // this.postError()
    // },
    updatePhotoCollection(e) {
      this.photos = e
    },
    firedFileInput() {
      this.$refs.fileInput.click()
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
      // this.$store.commit('changeLoader', true)

      const error = {
        id: this.id,
        _createUTC: new Date(Date.now()).toISOString(),
        info: {
          Проект: this.$store.state.cabinetInfo.info['project number'],
          Шкаф: this.$store.state.cabinetInfo.info['cab name'],
          wo: this.$store.state.cabinetInfo.info.wo.toString(),
          Добавил: this.$store.state.user.info.userDetails.toLowerCase(),
          Мастер: this.$store.state.cabinetInfo.info['senior fitter'].toLowerCase(),
          status: Object.values(this.errorBody.Устранено)[0]
            ? 'closed'
            : Object.values(this.errorBody.Принято)[0]
              ? 'confirmed'
              : 'open',
        },
        photos: this.photos,
        type: this.role,

        body: [
          {
            ...this.errorBody,
            _changed: this.$store.state.user.info.userDetails.toLowerCase(),
            _time: `${Date.now()}`,
          },
        ],
      }
      try {
        await this.$store.dispatch('UPLOAD_PHOTOS', 'errors-photo')
        // await $store.dispatch('DELETE_PHOTOS')
        await fetch('/api/post_item', {
          method: 'POST', // или 'PUT'
          body: JSON.stringify({
            ...error,
          }),
        })
      } finally {
        this.errorBody = {
          Открыто: {},
          Принято: {},
          Устранено: {},
        }
        this.$router.back()
        // this.$store.commit('changeLoader', false)
      }
    },
  },
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
input[type="submit"] {
  border: 1px solid green;
  background-color: rgba(0, 207, 0, 0.205);
}
input[type="number"] {
  height: 30px;
}
input[type="submit"]:hover {
  background-color: rgb(0, 83, 0);
  color: white;
}
</style>
