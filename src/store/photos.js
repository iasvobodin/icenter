export default {
  state: () => ({
    passedTime: null,
    cabtimeWithStatus: null,
    currentPhotos: [],
    blobFiles: [],
    deletePhotos: [],
    formData: new FormData(),
    allSumm: 0,
  }),
  mutations: {
    changePassedTime(state, payload) {
      state.passedTime = payload
    },
    setCabtimeWithStatus(state, payload) {
      state.cabtimeWithStatus = payload
    },
setSummResult(state, payload) {
  state.allSumm = payload
},
  },
  actions: {},
  getters: {},
  //   }
}
