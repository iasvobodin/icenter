import { Module } from 'vuex'
import { rootState } from '@/types/rootState'

type State = {
  firstName: string
  lastName: string
  userId: number | null
}

const storeModule: Module<State, rootState> = {
  namespaced: true,
  state: {
    firstName: '',
    lastName: '',
    userId: null
  },
  getters: {
    firstName: (state) => state.firstName,
    fullName: (state) => `${state.firstName} ${state.lastName}`,
    loggedIn: (state) => state.userId !== null,
    // combine with some state from other modules
    // fullUserDetails: (state, getters, rootState, rootGetters) => {
    //   return {
    //     ...state,
    //     fullName: getters.fullName,
    //     // read the state from another module named `auth`
    //     // ...rootState.auth.preferences,
    //     // read a getter from a namespaced module called `email` nested under `auth`
    //     ...rootGetters['auth/email'].details
    //   }
    // }
  },
  actions: {
    async loadUser({ state, commit }, id: number) {
      console.log('e');

    }
  },
  mutations: {
    updateUser(state, payload) {
      state.firstName = payload.firstName
      state.lastName = payload.lastName
      state.userId = payload.userId
    },
    clearUser(state) {
      state.firstName = ''
      state.lastName = ''
      state.userId = null
    }
  }
}

export default storeModule