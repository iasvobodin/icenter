<template>
  <h3 v-if="currentPhotos.length > 0">Фотографии</h3>
  <div>
    <input
      v-show="false"
      id="imageFile"
      ref="fileInput"
      multiple
      type="file"
      accept="image/*"
      @input="convertFilesToArray"
    />
    <div class="photo__gallery">
      <div v-for="(url, i) in currentPhotos" :key="i" class="photo__holder">
        <a :href="`${state.storage}${container}/${url}`">
          <img
            class="canvas__el"
            :src="`${state.storage}${container}/thumb__${url}`"
            alt=""
          />
        </a>
        <div
          v-if="changePhotosFlag"
          class="delete__icon"
          @click="deleteCurrentPhoto(url, i)"
        >
          &#10060;
        </div>
      </div>
      <div v-for="(url, i) in state.blobLink" :key="i" class="photo__holder">
        <img v-if="changePhotosFlag" class="canvas__el" :src="url" alt="ph" />
        <div
          v-if="changePhotosFlag"
          class="delete__icon"
          @click="deletePhoto(i)"
        >
          &#10060;
        </div>
      </div>
      <img
        v-if="changePhotosFlag"
        class="add__photo"
        src="/img/add__image.svg"
        alt=""
        @click="firedFileInput"
      />
    </div>
  </div>
</template>

<script setup>
import { useFetch } from '@/hooks/fetch'
import { reactive, ref, toRefs } from '@vue/reactivity'
import {
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  watch,
  watchEffect,
} from '@vue/runtime-core'
import * as imageConversion from 'image-conversion'
import { useStore } from 'vuex'
const store = useStore()
const props = defineProps({
  currentPhotos: {
    type: Array,
    default: () => [],
  },
  changePhotosFlag: {
    type: Boolean,
    default: () => false,
  },
  container: {
    type: String,
    required: true,
  },
  objectId: {
    type: String,
    required: true,
  },
  saveChangesPhoto: {
    type: Boolean,
    required: true,
    default: () => false,
  },
})
const emit = defineEmits({
  deleteBlob: null,
  resizedBlob: null,
  uploadChanges: null,
  updatedPhotos: null,
})

const {
  currentPhotos,
  changePhotosFlag,
  container,
  saveChangesPhoto,
  objectId,
} = toRefs(props)

const fileInput = ref(null)

store.commit('SetPhotosContainer', props.container)

const state = reactive({
  emitPhotos: [],
  photosForDelete: [],
  blobLink: [],
  storage: 'https://icaenter.blob.core.windows.net/',
  files: {
    fileInputUnic: [],
    compressBlob: [],
  },
})

const firedFileInput = () => {
  fileInput.value.click()
}

const photosForDelete = []

const deleteCurrentPhoto = (el, i) => {
  photosForDelete.push(
    `/api/blob?container=${props.container}&fileName=${el}&delblob=true`,
    `/api/blob?container=${props.container}&fileName=thumb__${el}&delblob=true`
  )
  //DELETE PROPS !!!  IMPLICIT BEHAVIOR
  currentPhotos.value.splice(i, 1)
  // props.currentPhotos.splice(i, 1)
  store.commit('SetPhotosToDelete', photosForDelete)
  // emit('deleteBlob', photosForDelete)
}
watchEffect(() => {
  emit('updatedPhotos', [...currentPhotos.value, ...state.emitPhotos])
})
const deletePhoto = (i) => {
  state.files.fileInputUnic.splice(i, 1)
  state.files.compressBlob.splice(i, 1)
  URL.revokeObjectURL(state.blobLink[i])
  state.blobLink.splice(i, 1)
  uploadChangesStore(state.files.compressBlob)
  //emit('resizedBlob', state.files.compressBlob)
}

const compressPhoto = async (f, i) => {
  //SET PLACEHOLDER BY INDEX
  state.blobLink[i] = '/img/Eclipse.gif'

  const compressBlob = await imageConversion.compressAccurately(f, {
    size: 450,
    accuracy: 0.9, //The compressed image size is 100kb
    type: 'image/jpeg',
  })

  state.files.compressBlob[i] = compressBlob

  state.blobLink[i] = URL.createObjectURL(compressBlob)
}

const checkIfFileExist = async (e) => {
  // console.log(Object.values(e.target.files), 'inside file target');
  console.log(Object.values(fileInput.value.files))
  console.log(e)
  await Promise.all(
    e.map(async (f) => {
      if (!state.files.fileInputUnic.some((file) => f.name === file.name)) {
        state.files.fileInputUnic.push(f)
        await compressPhoto(f, state.files.fileInputUnic.length - 1)
      }
    })
  )
  uploadChangesStore(state.files.compressBlob)
}

const convertFilesToArray = (e) => {
  const ff = Object.values(e.target.files)
  checkIfFileExist(ff)
}

const uploadChangesStore = (blobArr) => {
  const formData = new FormData()
  const unicId = Date.now()
  const emitPhotos = []
  if (blobArr.length > 0) {
    blobArr.map((e, i) => {
      const imageName = `${
        props.objectId
      }__${store.state.user.info.userDetails.toLowerCase()}__${unicId + i}.jpg`
      emitPhotos.push(imageName)
      formData.set(`photo${unicId + i}`, e, imageName)
    })
    state.emitPhotos = emitPhotos
    store.commit('SetPhotosToUpload', formData)
  }
}

const uploadChanges = async () => {
  const formData = new FormData()
  const unicId = Date.now()

  // UPLOAD PHOTOS
  const options = {
    method: 'POST',
    body: formData,
  }
  const { request, response } = useFetch(
    `/api/blob?container=${props.container}&test=true`,
    options
  )

  //DELETE PHOTOS
  if (photosForDelete.length > 0) {
    await Promise.all(
      photosForDelete.map(async (e) => {
        const { request: deletePhoto } = useFetch(e)
        await deletePhoto()
      })
    )
  }

  if (state.files.compressBlob.length > 0) {
    state.files.compressBlob.map((e, i) => {
      const imageName = `${
        props.objectId
      }__${store.state.user.info.userDetails.toLowerCase()}__${unicId + i}.jpg`

      state.emitPhotos.push(imageName)

      URL.revokeObjectURL(state.blobLink[i])
      state.blobLink.splice(i, 1)

      formData.set(`photo${unicId + i}`, e, imageName)
    })
    await request()
    store.commit('SetPhotosToUpload', formData)
  }

  return [...currentPhotos.value, ...state.emitPhotos]
}

watch(saveChangesPhoto, (newV, oldV) => {
  if (newV === true) {
    emit('uploadChanges', uploadChanges())
  }
})

// const checkIfFileExistFromBufer = async () => {
//   // await Promise.all(
//     // Object.values(fileInput.value.files).map(async (f) => {
//     //   if (!state.files.fileInputUnic.some((file) => f.name === file.name)) {
//       await compressPhoto(f, state.files.fileInputUnic.length - 1)
//         state.files.fileInputUnic.push(f)
//       // }
//     // }
//     // )
//   // )
//   emit('resizedBlob', state.files.compressBlob)
// }
const retrieveImageFromClipboardAsBlob = (pasteEvent) => {
  const items = pasteEvent.clipboardData.items
  const pasteFiles = []
  for (var i = 0; i < items.length; i++) {
    // Skip content if not image
    if (items[i].type.indexOf('image') === -1) continue
    // Retrieve image on clipboard as blob
    const blob = items[i].getAsFile()
    pasteFiles.push(blob)
    // callback(blob, state.blobLink.length)
  }
  console.log(pasteFiles)
  checkIfFileExist(pasteFiles)
}

// onMounted(() => {
//   window.addEventListener(
//     'paste',
//     (e) => {
//       // Handle the event
//       retrieveImageFromClipboardAsBlob(e, compressPhoto)
//     },
//     false
//   )
// })
// onBeforeUnmount(() => {
//   window.removeEventListener(
//     'paste',
//     (e) => {
//       // Handle the event
//       retrieveImageFromClipboardAsBlob(e, compressPhoto)
//     },
//     false
//   )
// })

onMounted(() => {
  window.addEventListener(
    'paste',
    (e) => {
      // Handle the event
      retrieveImageFromClipboardAsBlob(e)
    },
    false
  )
})
onBeforeUnmount(() => {
  window.removeEventListener(
    'paste',
    (e) => {
      // Handle the event
      retrieveImageFromClipboardAsBlob(e)
    },
    false
  )
})

// onUnmounted(
//   () =>
//     //CLEARSTATE
//     store.commit('SetPhotosContainer', ''),
//   store.commit('SetPhotosToDelete', []),
//   store.commit('SetPhotosToUpload', new FormData())
// )
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
  padding: 1vh;
}
.canvas__el {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
.photo__gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  row-gap: 1vh;
  column-gap: 1vh;
}
.photo__holder {
  position: relative;
  width: 150px;
  height: 150px;
  overflow: hidden;
  border-radius: 4px;
  place-self: center;
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
img {
  cursor: pointer;
}
</style>
