<template>
  <div class="cabinet">
    <div>
      <!-- <h1>{{ $route.params.errorId }}</h1> -->
      <h1>Ошибка от ({{ errorHeader() }})</h1>
      <br />
    </div>
    <div v-if="state.error?.body" class="cabinet__info">
      <section class="information">
        <info-render :info-data="state.error.info" />
      </section>
      <section v-for="(val, key) in state.error.body[0]" :key="key" class="eror__body">
        <div v-if="val && Object.values(val)[1] && !key.startsWith('_')">
          <!-- {{key}} -->
          <div v-if="!returnRender(key)">
            <h2>{{ key }}</h2>
            <info-render :info-data="val" />
          </div>
        </div>
      </section>
      <section class="mod__error__body">
        <form id="errorData" @submit.prevent="updateErorData">
          <div
            v-for="(value, key, index) in $store.state.template?.error[
              state.error.type
            ]"
            :key="index"
          >
            <div v-if="returnRender(key)">
              <h3 class="statusHeader">Статус ошибки: {{ key }}</h3>
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
                <render-inputs
                  v-model="state.error.body[0][key]"
                  :required="
                    !$store.state.user.info.userRoles.includes('admin')
                  "
                  :data-render="v"
                />
              </div>
              <div
                v-if="
                  key &&
                  key === 'Открыто' &&
                  state.error.body[0][key] &&
                  state.error.body[0][key]['Ответственный']
                "
              >
                <div class="error__item">
                  <h4 class="error__item__title">{{ state.error.body[0][key]['Ответственный'] }}</h4>
                  <select
                    v-if="
                      typeof state.error.body[0].Открыто['Ответственный'] ===
                      'string'
                    "
                    v-model="state.error.body[0].Открыто['Ошибку допустил']"
                    required
                    :name="key"
                    :value="state.error.body[0].Открыто['Ошибку допустил']"
                    class="error__item__desc"
                  >
                    <option
                      v-for="(value2, key2, index2) in $store.state.template[
                        state.error.body[0].Открыто['Ответственный']
                      ]"
                      :key="index2"
                    >{{ value2 }}</option>
                  </select>
                </div>
              </div>
              <!-- <conditional-render v-model="error.body[key]" :data-render="value"
              :required="!$store.state.user.info.userRoles.includes('admin')" />-->
            </div>
          </div>
        </form>
      </section>
      <item-photo-uploader
        :change-photos-flag="state.changeInfo"
        :container="container"
        :current-photos="state.error.photos"
        :object-id="state.error.id"
        :save-changes-photo="state.saveChanges"
        @updated-photos="updatePhotoCollection"
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
        state.error?.body &&
        !state.changeInfo &&
        (state.error?.info.Добавил === $store.state.user.info.userDetails ||
          state.error?.info.status === 'confirmed' ||
          $store.state.user.info.userRoles.includes('admin'))
      "
      @click="changeData"
    >{{ !state.changeInfo ? 'Редактировать' : 'Отмена' }}</button>
    <button
      v-if="
        state.changeInfo && $store.state.user.info.userRoles.includes('admin')
      "
      @click="state.popupOpened = true"
    >Удалить</button>
    <button v-if="state.changeInfo" type="submit" form="errorData">Сохранить</button>
  </div>
  <teleport to="body">
    <confirm-popup :opened="state.popupOpened" @closed="popupClosed" @confirm="popupConfirmed">
      <template #header>
        <h3 class="popText">Удалить ошибку?</h3>
      </template>
      <!-- <template #action>
          <button class="cancel" @click="popupClosed">Отмена</button>
          <button class="confirm" @click="confirm">Да</button>
      </template>-->
    </confirm-popup>
  </teleport>
  <!-- <img crossorigin="anonymous" src="https://icaenter.blob.core.windows.net/errors-photo/21-01-04-12-30-23.jpg" alt="11"> -->
</template>

<script setup lang="ts">
import confirmPopup from '@/components/modal/cunfirmPopup.vue'
import itemPhotoUploader from '@/components/itemPhotoUploader.vue'
import conditionalRender from '@/components/conditionalRender.vue'
import infoRender from '@/components/infoRender.vue'
import renderInputs from '@/components/renderInputs'
import { reactive, Ref } from '@vue/reactivity'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useFetch } from '@/hooks/fetch'
import { errorType } from '@/types/errorType'
import { userType } from '@/types/userType'
import { templateType } from '@/types/templateType'
const store = useStore()
const route = useRoute()
const router = useRouter()
type UsableError = Promise<{ errorFromServer: Ref<errorType | undefined> }>

const state = reactive({
  popupOpened: false,
  saveChanges: false,
  changeInfo: false,
  updatedPhotos: [] as string[],
  error: <errorType>{},
  readOnlyError: <errorType>{},
  errorIsNotDef: null,
})

const container = 'errors-photo'

const errorHeader = () => {
  // const head:string = route.params.errorId
  if (typeof route.params.errorId === 'string') {
    const headSplit = route.params.errorId.split('__')
    //return
    //  console.log(headSplit[1],Date.now(),);
    // new Date(headSplit[1]).toISOString()
    return new Date(+headSplit[1]).toLocaleString()
  }
}
const getCurrentError = async (): UsableError => {
  // try {
  const { request, response: errorFromServer } = useFetch<errorType>(
    `/api/getitembyid/${route.params.errorId}`
  )

  await request()
  return { errorFromServer }
}

const getData = async () => {
  const errorFromServer = (await getCurrentError()).errorFromServer.value
  errorFromServer && (state.error = errorFromServer)
  state.error!.body = [state.error!.body[state.error!.body.length - 1]]
}
getData()
// methods: {
const updatePhotoCollection = (e: string[]) => {
  state.updatedPhotos = e
}
const deleteError = async () => {
  const delErr = {
    method: 'POST', // или 'PUT'
    body: JSON.stringify({
      id: state.error!.id,
      type: state.error!.type,
      info: {
        status: state.error!.info.status,
        wo: state.error!.info.wo,
      },
      ttl: 10,
    }),
  }

  const { request, response } = useFetch('/api/post_item', delErr)

  await request()

  if (state.error!.photos!.length > 0) {
    store.commit('PreparePhotosToDelete', {
      photos: state.error!.photos,
      container: 'errors-photo',
    })
    await store.dispatch('DELETE_PHOTOS')
  }

  // if (state.error!.photos!.length > 0) {
  //   await Promise.all(
  //     state.error!.photos!.map(async (e) => {
  //       await fetch(
  //         `/api/blob?container=errors-photo&fileName=${e}&delblob=true`
  //       )
  //     })
  //   )
  // }

  router.back()
}

const returnRender = (key: string) => {
  if (state.changeInfo && store.state.user.info.userRoles.includes('admin')) {
    return true
  }
  if (state.changeInfo && state.error!.info.status === 'confirmed') {
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
    store.state.user.info.userDetails.toLowerCase() ===
      state.error!.info.Добавил
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
  const err = (await getCurrentError()).errorFromServer.value

  const photos = state.updatedPhotos
  // OBJECT FOR NEW UPDATET ERROR
  let user = {} as userType
  const u = localStorage.getItem('user')
  u && (user = JSON.parse(u))

  const updateErorBody = {
    ...err,
    info: {
      ...err!.info,
      status: Object.values(state.error!.body[0].Устранено)[0]
        ? 'closed'
        : Object.values(state.error!.body[0].Принято)[0]
        ? 'confirmed'
        : 'open',
    },
    body: [
      ...err!.body, //CURRENT BODY +
      {
        ...state.error!.body[0], //CHANGED BODY
        _changed: user.info.userDetails.toLowerCase(),
        _time: `${Date.now()}`,
      },
    ],
    photos,
  }
  const { request, response } = useFetch('/api/post_item', {
    method: 'POST', // или 'PUT'
    body: JSON.stringify(updateErorBody),
  })

  await store.dispatch('UPLOAD_PHOTOS', 'errors-photo')
  // await store.dispatch('DELETE_PHOTOS')
  await request()
  // try {
  //   await fetch('/api/post_item', {
  //     method: 'POST', // или 'PUT'
  //     body: JSON.stringify(updateErorBody),
  //   })
  // } finally {
  getData()
  state.changeInfo = !state.changeInfo
  // }
}

const popupClosed = () => {
  state.popupOpened = false
}
const popupConfirmed = async () => {
  await deleteError()
  state.popupOpened = false
  // state.popupOpened = false
}
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
  background-image: url("/img/add__image.svg");
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
.statusHeader {
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
