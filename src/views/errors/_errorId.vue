<template>
  <div class="cabinet">
    <div>
      <h1>{{ $route.params.errorId }}</h1>
      <br />
    </div>
    <div v-if="state.error" class="cabinet__info">
      <section class="information">
        <info-render :info-data="state.error.info" />
      </section>
      <section
        v-for="(val, key) in state.error.body"
        :key="val.id"
        class="eror__body"
      >
        <div v-if="Object.values(val)[1] && !key.startsWith('_')">
          <!-- {{key}} -->
          <div v-if="!returnRender(key, val)">
            <h2>{{ key }}</h2>
            <info-render :info-data="val" />
          </div>
        </div>
      </section>
      <section class="mod__error__body">
        <form id="errorData" @submit.prevent="state.saveChanges = true">
          <div
            v-for="(value, key, index) in $store.state.template?.error[
              state.error.type
            ]"
            :key="index"
          >
            <div v-if="returnRender(key, value)">
              <h3>Статус ошибки: {{ key }}</h3>
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
                <render-inputs
                  v-model="state.error.body[key]"
                  :required="
                    !$store.state.user.info.userRoles.includes('admin')
                  "
                  :data-render="v"
                />
              </div>
              <div
                v-if="
                  state.error.body[key] &&
                  state.error.body[key]['Ответственный']
                "
              >
                <div class="error__item">
                  <h4 class="error__item__title">
                    {{ state.error.body[key]['Ответственный'] }}
                  </h4>
                  <select
                    v-model="state.error.body[key]['Ошибку допустил']"
                    required
                    :name="key"
                    :value="state.error.body[key]['Ошибку допустил']"
                    class="error__item__desc"
                  >
                    <option
                      v-for="(value2, key2, index2) in $store.state.template[
                        state.error.body[key2]['Ответственный']
                      ]"
                      :key="index2"
                    >
                      {{ value2 }}
                    </option>
                  </select>
                </div>
              </div>
              <!-- <conditional-render v-model="error.body[key]" :data-render="value"
                :required="!$store.state.user.info.userRoles.includes('admin')" /> -->
            </div>
          </div>
        </form>
      </section>
      <item-photo-uploader
        v-if="state.error"
        :change-photos="state.changeInfo"
        container="errors-photo"
        :current-photos="state.error.photos"
        :object-id="state.error.id"
        :save-changes-photo="state.saveChanges"
        @uploadChanges="mainEmitFromPhotos"
      />
    </div>
    <div v-else class="loading" />
    <p v-if="state.errorIsNotDef">{{ state.errorIsNotDef }}</p>
  </div>
  <br />
  <br />
  <div class="button__block">
    <button
      v-if="
        state.error &&
        !state.changeInfo &&
        (state.error?.info.Добавил === $store.state.user.info.userDetails ||
          state.error?.info.status === 'confirmed' ||
          $store.state.user.info.userRoles.includes('admin'))
      "
      @click="changeData"
    >
      {{ !state.changeInfo ? 'Редактировать' : 'Отмена' }}
    </button>
    <button
      v-if="
        state.changeInfo && $store.state.user.info.userRoles.includes('admin')
      "
      @click="deleteError"
    >
      Удалить
    </button>
    <button v-if="state.changeInfo" type="submit" form="errorData">
      Сохранить
    </button>
  </div>

  <!-- <img crossorigin="anonymous" src="https://icaenter.blob.core.windows.net/errors-photo/21-01-04-12-30-23.jpg" alt="11"> -->
</template>

<script setup>
import itemPhotoUploader from '@/components/itemPhotoUploader.vue'
import conditionalRender from '@/components/conditionalRender.vue'
import infoRender from '@/components/infoRender.vue'
import renderInputs from '@/components/renderInputs'
import { reactive } from '@vue/reactivity'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useFetch } from '@/hooks/fetch'

const store = useStore()
const route = useRoute()
const router = useRouter()
// export default {
//   components: {
//     itemPhotoUploader,
//     renderInputs,
//     infoRender,
//   },
//   data() {
//     return {
//       saveChanges: false,
//       changeInfo: false,
//       error: null,
//       state.errorIsNotDef: null,
//     }
//   },
const state = reactive({
  saveChanges: false,
  changeInfo: false,
  error: null,
  errorIsNotDef: null,
})

const getCurrentError = async () => {
  try {
    const responsError = await fetch(`/api/errors/${route.params.errorId}`)
    const error = await responsError.json()
    if (!responsError.ok) {
      state.errorIsNotDef = 'Данной ошибки не существует'
      console.log('Данной ошибки не существует')
    }

    return error
  } catch (error) {
    state.errorIsNotDef = 'Данной ошибки не существует'
    console.log('errors is not def', error)
  }
}

const getData = async () => {
  state.error = await getCurrentError()
  state.error.body = state.error.body[state.error.body.length - 1]
}
getData()
// methods: {
const mainEmitFromPhotos = async (e) => {
  state.error.photos = await e
  updateErorData()
}
const deleteError = async () => {
  const delErr = {
    method: 'POST', // или 'PUT'
    body: JSON.stringify({
      id: state.error.id,
      status: state.error.status,
      type: state.error.type,
      info: {
        wo: state.error.info.wo,
      },
      ttl: 10,
    }),
  }

  const { request, response } = useFetch('/api/post_item', delErr)

  await request()

  // await fetch('/api/POST_openError', delErr)
  // await fetch('/api/post_item', delErr)

  if (state.error.photos.length > 0) {
    await Promise.all(
      state.error.photos.map(async (e) => {
        await fetch(
          `/api/blob?container=errors-photo&fileName=${e}&delblob=true`
        )
      })
    )
  }
  // state.error.photos.length > 0 &&
  //   (await Promise.all(
  //     state.error.photos.map(async (e) => {
  //       await fetch(
  //         `/api/blob?container=errors-photo&fileName=${e}&delblob=true`
  //       )
  //     })
  //   ))
  router.back()
}

const returnRender = (key) => {
  if (state.changeInfo && store.state.user.info.userRoles.includes('admin')) {
    return true
  }
  if (state.changeInfo && state.error.info.status === 'confirmed') {
    if (key === 'Открыто') {
      return false
    }
    if (key === 'Принято') {
      return false
    }
    if (key === 'Устранено') {
      return true
    }
  }
  if (
    state.changeInfo &&
    store.state.user.info.userDetails.toLowerCase() === state.error.info.Добавил
  ) {
    if (key === 'Открыто') {
      return true
    }
    if (key === 'Принято') {
      return false
    }
    if (key === 'Устранено') {
      return false
    }
  }
}
const changeData = () => {
  state.changeInfo = !state.changeInfo
}
const updateErorData = async () => {
  //GET CURRENT ITEM FROM DB
  const err = await getCurrentError()
  const photos = state.error.photos
  // OBJECT FOR NEW UPDATET ERROR
  const updateErorBody = {
    ...err,
    info: {
      ...err.info,
      status: Object.values(state.error.body.Устранено)[0]
        ? 'closed'
        : Object.values(state.error.body.Принято)[0]
        ? 'confirmed'
        : 'open',
    },
    body: [
      ...err.body, //CURRENT BODY +
      {
        ...state.error.body, //CHANGED BODY
        _changed: JSON.parse(
          localStorage.getItem('user')
        ).info.userDetails.toLowerCase(),
        _time: `${Date.now()}`,
      },
    ],
    photos,
  }
  try {
    await fetch('/api/post_item', {
      method: 'POST', // или 'PUT'
      body: JSON.stringify({
        ...updateErorBody,
      }),
    })
  } finally {
    state.error = await getCurrentError()
    state.error.body = state.error.body[state.error.body.length - 1]
    state.changeInfo = !state.changeInfo
  }
}

// },
// }
</script>

<style lang="css" scoped>
.add__photo {
  width: 100px;
  place-self: center;
  cursor: pointer;
}

.custom-file-input:hover::before {
  border-color: black;
}
.custom-file-input:active::before {
  background: -webkit-linear-gradient(top, #e3e3e3, #f9f9f9);
  background-image: url('/img/add__image.svg');
}
.back__image {
  position: fixed;
  top: 10px;
  right: 80px;
  width: 40px;
  border: 1px solid black;
  border-radius: 4px;
  cursor: pointer;
}
.delete__image {
  top: -30px;
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.photos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  column-gap: 1vh;
  row-gap: 1vh;
}
.photo__holder {
  /* width: 100px; */
  position: relative;
  /* height: 100px; */
  place-self: center;
  margin: auto;
  margin-top: 1vh;
  margin-bottom: 1vh;
  box-sizing: border-box;
  /* overflow: hidden; */
  border-radius: 4px;
}
.error__photos {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
.description__area {
  width: inherit;
}
.loading {
  margin: auto;
  width: 30px;
  height: 30px;
  background: url(/img/loading.gif) no-repeat center bottom;
}
p {
  font-size: 16px;
}
h3 {
  margin: 5px;
}
.cabinet {
  border: 1px solid orange;
  border-radius: 4px;
  margin: auto;
  margin-top: 1vh;
  margin-bottom: 1vh;
  width: min(95vw, 600px);
  padding: 10px;
  box-sizing: border-box;
}
h1 {
  padding: 10px;
  font-size: 30px;
}
h2 {
  margin: 7px;
}
.cabinet__info {
  /* width: min(95vw, 400px); */
  width: 100%;
  box-sizing: border-box;
  margin: auto;
}
.cabinet__info__desc {
  /* border-bottom: 1px solid black; */
  padding: 5px;
  /* width: 100%; */
}
.cabinet__info__desc > h3 {
  margin-top: 1vh;
  margin-bottom: 1vh;
}
/* .cabinet__info__item {
  border-bottom: 1px solid black;
  padding: 5px;
  display: grid;
  grid-template-columns: 1fr 4fr;
}
.cabinet__info__item > h3 {
  justify-self: start;
  align-self: center;
  text-align: start;
}
.cabinet__info__item > p {
  justify-self: end;
  text-align: end;
  align-self: center;
} */
.cabinet__info__item > select {
  justify-self: end;
  text-align: end;
  align-self: center;
}
.error__item__desc {
  justify-self: end;
  text-align: end;
  align-self: center;
  margin: 0;
}
/* .error__item__vertical__title {
  text-align: center;
  margin: 5px;
}
.error__item__vertical__desc {
  padding: 5px;
  text-align: start;
} */
.button__block {
  padding-bottom: 2vh;
}
</style>
