export default {
  state: () => ({
    currentPhotos: [],
    blobFiles: [],
    deletePhotos: [],
    formData: new FormData(),
  }),
  mutations: {
    setBlobFiles(state, payload) {
      console.log(state.user.info.userDetails.toLowerCase())
      // if (state.cabTime.blobFiles.length > 0) {
      //     !state.cabTime.photos && (state.cabTime.photos = [])
      //     state.formData

      //     state.cabTime.blobFiles?.forEach((e, i) => {
      //       const unic = Date.now()
      //       const imageName = `${
      //         state.cabTime.id
      //       }__${store.state.user.info.userDetails.toLowerCase()}__${unic + i}.jpg`

      //       state.cabTime.photos.push(imageName)

      //       formData.set(`photo${unic + i}`, e, imageName)
      //     })

      //     // UPLOAD PHOTOS
      //     const { request, response } = useFetch(
      //       '/api/blob?container=cabtime-photo&test=true',
      //       {
      //         method: 'POST',
      //         body: formData,
      //       }
      //     )
      //     await request()
      //     state.cabTime.blobFiles = null
      //   }
      // }
      state.blobFiles.push(payload)
    },
  },
  actions: {},
  getters: {},
  //   }
}
