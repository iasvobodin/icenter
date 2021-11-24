export interface timeTrackingType {
  passedTime: null
  cabtimeWithStatus: null
  allSumm: 0
}

const state = () =>
  ({
    passedTime: null,
    cabtimeWithStatus: null,
    allSumm: 0,
  } as timeTrackingType)

export const timeTracking = {
  state,
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
