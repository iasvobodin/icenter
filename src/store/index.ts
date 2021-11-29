import { createStore, Store } from 'vuex'
import { useFetch } from '@/hooks/fetch'
// import { timeTracking, timeTrackingType } from './timeTracking'
import { InjectionKey } from 'vue'
import { userType } from '@/types/userType'
import { templateType } from '@/types/templateType'
import { projectInfoType, projectType } from '@/types/projectInfoType'

// const createName = (clientPrincipal) => {
//   if (clientPrincipal.identityProvider === 'aad') {
//     const splitName = clientPrincipal.userDetails.split('@')[0].split('.')
//     const name =
//       splitName[0][0].toUpperCase() + '.' + splitName[1][0].toUpperCase() + '.'
//     return name
//   }
//   return clientPrincipal.userDetails.split('@')[0]
// }

// export interface State {
//     loader: boolean,
//     template: null,
//     projectList: null,
//     selectedProjectNumber: '',
//     projectInfo: null,
//     user: userType,
//     currentError: null,
//     cabinetItems: [],
// }

// export const key: InjectionKey<Store<State>> = Symbol()

export interface State {
  loader: false
  template: templateType
  projectList: null
  selectedProjectNumber: string
  projectInfo: projectInfoType
  user: userType
  currentError: null
  cabinetItems: []
  passedTime: number
  cabtimeWithStatus: null
  allSumm: number
  photosToUpload: FormData
  compressBlob: Blob[]
  photosToDelete: string[]
  photoContainer: string
}

export const store = createStore<State>({
  state: {
    photosToUpload: new FormData(),
    photosToDelete: [],
    photoContainer: '',
    compressBlob: [],
    loader: false,
    template: {} as templateType,
    projectList: null,
    selectedProjectNumber: '',
    projectInfo: {} as projectInfoType,
    user: <userType>{},
    currentError: null,
    cabinetItems: [],
    passedTime: 0,
    cabtimeWithStatus: null,
    allSumm: 0,
  },
  mutations: {
    SetPhotosToUpload(state, payload: FormData) {
      state.photosToUpload = payload
    },
    SetPhotosToDelete(state, payload: string[]) {
      state.photosToDelete = payload
    },
    // SetPhotosContainer(state, payload: string) {
    //   state.photoContainer = payload
    // },
    PreparePhotosToDelete(state, payload: {photos:string[], container:string}) {
      state.photosToDelete = payload.photos.reduce((acc:string[], e )=>{
        acc.push(`/api/blob?container=${payload.container}&fileName=${e}&delblob=true`)
        acc.push( `/api/blob?container=${payload.container}&fileName=thumb__${e}&delblob=true`)
        return acc
       },[])
    },
    changePassedTime(state, payload) {
      state.passedTime = payload
    },
    setCabtimeWithStatus(state, payload) {
      state.cabtimeWithStatus = payload
    },
    setSummResult(state, payload) {
      state.allSumm = payload
    },
    SET_cabinetItems(state, payload) {
      state.cabinetItems = payload
    },
    changeLoader(state, payload) {
      state.loader = payload
    },
    setUserAuth(state, payload: string) {
      state.user = JSON.parse(payload)
    },

    setTemplate(state, payload) {
      state.template = payload
    },
    extendTemplate(state, payload) {
      state.template as templateType
      state.template.template = payload
    },
    SETprojectNumber(state, payload) {
      state.selectedProjectNumber = payload
    },
    SETcurrentProject(state, payload: projectInfoType) {
      state.projectInfo = payload
      // console.log(state.projectInfo, "state.projectInfo");
    },
    SETprojectInfo(state, payload) {
      state.projectInfo = {
        'project number': payload.id,
        ...payload.info.base,
        ...payload.info.extends,
      }
      // console.log(state.projectInfo, "state.projectInfo");
    },
    SETcabinetInfo(state, payload) {
      state.projectInfo = {
        ...state.projectInfo,
        wo: payload.split('   ')[0],
        'cab name': payload.split('   ')[1],
      }
      // console.log(state.projectInfo, "state.projectInfo");
    },
    SET_projectList(state, payload) {
      state.projectList = payload
    },
  },
  actions: {
    async UPLOAD_PHOTOS({ commit, state }, payload: string) {
      const { request, response } = useFetch(
        `/api/blob?container=${payload}&test=true`,
        { method: 'POST', body: state.photosToUpload }
      )
      await request()
      //CLEAR STATE AFTER UPLOAD
      commit('SetPhotosToUpload', new FormData())
    },
    async DELETE_PHOTOS({ commit, state }) {
      if (state.photosToDelete.length > 0) {
        await Promise.all(
          state.photosToDelete.map(async (e) => {
            const { request: deletePhoto } = useFetch(e)
            await deletePhoto()
          })
        )
        //CLEAR STATE AFTER DELETE
        commit('SetPhotosToDelete', [])
      }
    },
    //
    // if (photosForDelete.length > 0) {
    //   await Promise.all(
    //     photosForDelete.map(async (e) => {
    //       const { request: deletePhoto } = useFetch(e)
    //       await deletePhoto()
    //     })
    //   )
    // }
    // async getCabinetsInfo({ commit }, payload) {
    //   const projects:projectType[] = []
    //   const { request, response } = useFetch<projectType[]>('/api/projects?status=open')
    //   await request()
    //   response.value!.forEach((p) => {
    //     p.cabinets.forEach((c) => {
    //       let payload = {
    //         ...c,
    //         ...p.info.base,
    //         ...p.info.extends,
    //         'project number': p.id,
    //       }
    //       projects.push(payload)
    //     })
    //   })
    //   const currentInfo = projects.find((e) => e.wo === payload)
    //   commit('SETcurrentProject', currentInfo)
    //   // console.log(projects);
    // },
    async getCabinetsInfo({ commit }, payload: string) {
      const projects: projectInfoType[] = []
      const { request, response } = useFetch<projectType[]>(
        '/api/projects?status=open'
      )
      await request()
      response.value!.forEach((p) => {
        p.cabinets.forEach((c) => {
          let payload: projectInfoType = {
            ...c,
            ...p.info.base,
            ...p.info.extends,
            'project number': p.id,
          }
          projects.push(payload)
        })
      })
      const currentInfo = projects.find((e) => e.wo === payload)
      commit('SETcurrentProject', currentInfo)
    },
    async GET_cabinetItems({ commit }, payload) {
      const { request, response } = useFetch(`/api/cabinetItems?wo=${payload}`)
      await request()

      commit('SET_cabinetItems', response.value)
    },
    async GET_template({ commit, state }) {
      console.log('GET TEMPLATE')

      !state.loader && commit('changeLoader', true)

      try {
        const resposeTemplate = await fetch(
          '/api/templates/templateProject/ver1'
        )
        const template = await resposeTemplate.json()
        commit('setTemplate', template)
        commit('changeLoader', false)
      } catch (error) {
        console.log(error, 'GETTEMPLATEERROR')
      }
    },
    async extendProject({ commit, state }) {
      console.log('GET projectExtend')

      !state.loader && commit('changeLoader', true)

      try {
        const resposeTemplate = await fetch('/api/templates/extendProject/ver1')
        const { projectTemplate } = await resposeTemplate.json()
        console.log(projectTemplate, 'projectTemplate')
        commit('extendTemplate', projectTemplate)
        commit('changeLoader', false)
      } catch (error) {
        console.log(error, 'GETprojectExtendERROR')
      }
    },
    async checkUser({ commit, state }) {
      console.log('checking User frome vuex')

      const registerUserRes = await fetch(
        `/api/user/${state.user?.id}?getRegisterUser=true`
      )
      if (registerUserRes.ok) {
        const userFromServer = await registerUserRes.json()
        const userFromLocal = window.localStorage.getItem('user')
        if (JSON.stringify(userFromServer) !== userFromLocal) {
          commit('setUserAuth', JSON.stringify(userFromServer))
          window.localStorage.setItem('user', JSON.stringify(userFromServer))
          //       document.documentElement.style.setProperty('--bg', `${userFromLocal.body?.bg}`);
          // document.documentElement.style.setProperty('--cursor', `${userFromLocal.body?.customCursor}`)
        }
      }
      // let user;//   console.log(responseUserAuth,'responseUserAuth');
      // if (registerUserRes.ok) {
      //   user = await registerUserRes.json()
      //   const name = createName(state.user.info)
      //   user.body.name = name
      // const LSuser = window.localStorage.getItem("user");

      // if (JSON.stringify(user) !== LSuser) {
      //   console.log('check user version');
      //   commit("setUserAuth", JSON.stringify(user));
      //   window.localStorage.setItem("user", JSON.stringify(user))
      // }

      // }
    },
    // async GET_auth({ commit, state }) {
    //   let clientPrincipal = null
    //   let responseUserAuth
    //   //check auth AAD
    //   if (import.meta.env.MODE === 'development') {
    //     clientPrincipal = {
    //       identityProvider: 'static',
    //       userId: '9c0c1980f5904d10b43e552d2b7c4041',
    //       userDetails: 'Ivan.Svobodin@Emerson.com',
    //       userRoles: ['admin', 'anonymous', 'icenter', 'authenticated'],
    //     }
    //   } else {
    //     console.log('try auth')
    //     responseUserAuth = await fetch('/.auth/me')
    //     const userAuth = await responseUserAuth.json()
    //     clientPrincipal = userAuth.clientPrincipal
    //     // if(!clientPrincipal) return
    //     if (!clientPrincipal && !window.location.toString().includes('login')) {
    //       window.location.href = '/login'
    //       return
    //     }
    //   }
    //   console.log(clientPrincipal, 'clientPrincipal after check auth')
    //   clientPrincipal.userDetails = clientPrincipal.userDetails.toLowerCase()
    //   // const splitName = clientPrincipal.userDetails.split('@')[0].split('.')
    //   // const name = splitName[0][0].toUpperCase() + '.' + splitName[1][0].toUpperCase() + '.'

    //   const name = createName(clientPrincipal)

    //   let user = {
    //     ...clientPrincipal,
    //     // name
    //   }

    //   try {
    //     const registerUserRes = await fetch(
    //       `/api/user/${clientPrincipal.userId}?getRegisterUser=true`
    //     )
    //     //   console.log(responseUserAuth,'responseUserAuth');
    //     if (registerUserRes.ok) {
    //       user = await registerUserRes.json()
    //       user.body.name = name
    //       window.localStorage.setItem('user', JSON.stringify(user))
    //       commit('setUserAuth', JSON.stringify(user))
    //     }
    //   } catch (error) {
    //     user = {
    //       id: clientPrincipal.userId,
    //       type: 'info',
    //       info: clientPrincipal,
    //       body: { name },
    //     }
    //     const options = {
    //       method: 'POST', // или 'PUT'
    //       body: JSON.stringify(user),
    //     }
    //     await fetch(
    //       `/api/user/${clientPrincipal.userId}?postRegisterUser=true`,
    //       options
    //     )
    //     window.localStorage.setItem('user', JSON.stringify(user))
    //     commit('setUserAuth', JSON.stringify(user))
    //   }

    //   console.log('GETAUTH')
    // },
    // async GET_projectList({ commit, state }, payload) {
    //   let data
    //   !state.projects.List &&
    //     (data = await (
    //       await fetch(`${payload}${state.selectedProjectNumber}`)
    //     ).json())
    //   // console.log(data, "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    //   commit('SET_projectList', data)
    // },
  },
  modules: {
    // timeTracking,
  },
})

// export function useStore() {
//   return baseUseStore(key)
// }
