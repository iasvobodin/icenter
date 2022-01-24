import { createStore, Store } from 'vuex'
import { useFetch } from '@/hooks/fetch'
// import { timeTracking, timeTrackingType } from './timeTracking'
import { InjectionKey, Ref } from 'vue'
import { userType, azureAuth } from '@/types/userType'
import { templateType } from '@/types/templateType'
import { projectInfoType, projectType } from '@/types/projectInfoType'
import { cabinetsType } from '@/types/cabinetsType'
import { cabtimeType } from '@/types/cabtimeTypes'
import { errorType } from '@/types/errorType'
import { strictEqual } from 'assert'
// import { cabinetInfo } from '@/types/cabinetsType'
type cabinetInfo = {
  "id": string,
  "type": string,
  "info": {
    "wo": string,
    "cab name": string,
    "project number": string,
    "Project Name": string,
    "status": string
  },
}
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
type cabItems = { [key: string]: any }
export interface State {
  activeErrors: errorType[]
  loader: false
  template: templateType
  projectList: null
  selectedProjectNumber: string
  projectInfo: projectInfoType
  user: userType
  cabinets: cabinetsType[]
  currentError: null
  cabinetItems: cabItems[]
  passedTime: number
  cabtimeWithStatus: cabtimeType['body']
  allSumm: number
  photosToUpload: FormData
  compressBlob: Blob[]
  photosToDelete: string[]
  photoContainer: string
  taskResult: { [index: string]: number }
}

export const store = createStore<State>({
  state: {
    activeErrors: <errorType[]>{},
    taskResult: {},
    photosToUpload: new FormData(),
    photosToDelete: [],
    photoContainer: '',
    compressBlob: [],
    loader: false,
    template: <templateType>{},
    projectList: null,
    selectedProjectNumber: '',
    projectInfo: <projectInfoType>{},
    user: <userType>{},
    currentError: null,
    cabinetItems: [],
    cabinets: [],
    passedTime: 0,
    cabtimeWithStatus: [],
    allSumm: 0,
  },
  mutations: {
    SET_activeErrors(state, payload: errorType[]) {
      state.activeErrors = payload
    },
    SET_cabinets(state, payload: cabinetsType[]) {
      state.cabinets = payload
    },
    UPDATE_cabinets(state, payload: cabinetsType) {
      console.log('inside commit updatecabinets', payload)

      const update = state.cabinets.map((x) => {
        if (x.id === payload.id) {
          console.log('match')

          return payload
        } else {
          return x
        }
      })
      state.cabinets = update
    },
    SetPhotosToUpload(state, payload: FormData) {
      state.photosToUpload = payload
    },
    SetPhotosToDelete(state, payload: string[]) {
      state.photosToDelete = payload
    },
    SET_USER(state, payload) {
      window.localStorage.setItem('user', JSON.stringify(payload))
      // store.commit('setUserAuth', JSON.stringify(payload))
      state.user = payload as userType
      // debugger
    },
    SET_TASK_DONE_SUMM(state, payload) {
      state.taskResult.doneSumm = payload
    },
    // SetPhotosContainer(state, payload: string) {
    //   state.photoContainer = payload
    // },
    PreparePhotosToDelete(
      state,
      payload: { photos: string[]; container: string }
    ) {
      state.photosToDelete = payload.photos.reduce((acc: string[], e) => {
        acc.push(
          `/api/blob?container=${payload.container}&fileName=${e}&delblob=true`
        )
        acc.push(
          `/api/blob?container=${payload.container}&fileName=thumb__${e}&delblob=true`
        )
        return acc
      }, [])
    },
    changePassedTime(state, payload: number) {
      state.passedTime = payload
    },
    setCabtimeWithStatus(state, payload: cabtimeType['body']) {
      state.cabtimeWithStatus = payload
    },
    setSummResult(state, payload) {
      state.allSumm = payload
    },
    SET_cabinetItems(state, payload: cabItems[]) {
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
    async UPLOAD_PHOTOS({ dispatch, commit, state }, payload: string) {
      const { request, response } = useFetch(
        `/api/blob?container=${payload}&test=true`,
        { method: 'POST', body: state.photosToUpload }
      )
      await request()
      //CLEAR STATE AFTER UPLOAD
      commit('SetPhotosToUpload', new FormData())
      if (state.photosToDelete.length > 0) {
        await dispatch('DELETE_PHOTOS')
      }
    },
    async DELETE_PHOTOS({ commit, state }) {
      await Promise.all(
        state.photosToDelete.map(async (e) => {
          const { request: deletePhoto } = useFetch(e)
          await deletePhoto()
        })
      )
      //CLEAR STATE AFTER DELETE
      commit('SetPhotosToDelete', [])
    },
    async CHECK_AUTH_GLOBAL({
      commit,
      dispatch,
      state,
    }): Promise<string | boolean> {
      const user: string | null = window.localStorage.getItem('user') // type string

      if (user) {
        const userParse: userType = JSON.parse(user) // type object local user
        if (!userParse.info.userRoles.includes('icenter')) {
          //CHECK ROLE
          return '/role'
        } else {
          //FIRST TIME CHECK
          Object.keys(state.user).length == 0 &&
            dispatch('CHECK_AUTH_SERVER', userParse) // LOCALSTORAGE USER
          return true
        }
      } else {
        const userCheck: false | userType = await dispatch('CHECK_AUTH_AZURE')
        if (userCheck) {
          //CHECK ROLE
          if (!userCheck.info.userRoles.includes('icenter')) {
            return '/role'
          } else {
            await dispatch('CHECK_AUTH_SERVER', userCheck)
            return true
          }
        } else {
          return '/login'
        }
      }
    },

    async CHECK_AUTH_AZURE(): Promise<false | userType> {
      const createName = (
        clientPrincipal: azureAuth['clientPrincipal']
      ): string => {
        if (clientPrincipal.identityProvider === 'aad') {
          const splitName = clientPrincipal.userDetails.split('@')[0].split('.')
          const name =
            splitName[0][0].toUpperCase() +
            '.' +
            splitName[1][0].toUpperCase() +
            '.'
          return name
        }
        return clientPrincipal.userDetails.split('@')[0]
      }

      try {
        const { request: auth, response } = useFetch<azureAuth>('/.auth/me')
        await auth()
        const user = response.value

        const { clientPrincipal } = user!
        //CREATE OBJECT FOR SERVER
        if (clientPrincipal) {
          const userRes = {
            id: clientPrincipal.userId,
            type: 'info',
            info: clientPrincipal,
            body: {
              name: createName(clientPrincipal),
            },
          }
          return userRes
        }
        return false
      } catch (error) {
        console.log(error, 'CHECK AUTH ERROR')
        return false
      }
    },
    async CHECK_AUTH_SERVER({ commit, dispatch, state }, user: userType | any) {
      const checkUserInLocal: string | null =
        window.localStorage.getItem('user')
      const userPayloadString = JSON.stringify(user)
      //IF PAYLOAD !==LOCAL
      if (checkUserInLocal) {
        if (checkUserInLocal !== userPayloadString) {
          console.log('IF PAYLOAD !==LOCAL')
          dispatch('POST_USER_DB', user) //NEED TO UPDATE DATA ON SERVER
        } else {
          Object.keys(state.user).length == 0 && commit('SET_USER', user)
        }
      } else {
        //USER LOCAL IS NOT EXIST
        try {
          const { request: getUser, response } = useFetch<userType>(
            `/api/user/${user.info.userId}?getRegisterUser=true`
          )
          await getUser()
          //USER IN SERVER IS EXIST => COMMIT
          const userServer = response.value
          Object.keys(state.user).length == 0 && commit('SET_USER', userServer)
        } catch (error) {
          console.log(error, 'USER IS NOT EXIST IN DB')
          //USER IS NOT EXIST, ADD NEW USER IN DB
          dispatch('POST_USER_DB', user)
        }
      }
    },
    async POST_USER_DB({ commit }, user: userType) {
      try {
        const { request: postUser } = useFetch<string>(
          `/api/user/${user.info.userId}?postRegisterUser=true`,
          {
            method: 'POST', // или 'PUT'
            body: JSON.stringify(user),
          }
        )
        await postUser()
        commit('SET_USER', user)
      } catch (error) {
        console.log(error, 'SAVE USER IN A SERVER IS FAILED')
      }
    },
    async GET_cabinets({ commit }) {
      // console.log('GET_cabinets');

      const { request: reqCabinets, response: resCabinets } =
        useFetch('/api/GET_cabinet')
      await reqCabinets()
      commit('SET_cabinets', resCabinets.value)
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
    // async createProjectInfo(payload:projectType) {
    //   const projects: projectInfoType[] = []
    //   const { request, response } = useFetch<projectType[]>(
    //     '/api/projects?status=open'
    //   )
    //   await request()

    //   // response.value!.forEach((p) => {
    //     payload.cabinets.forEach((c) => {
    //       const { request, response } = useFetch('/api/post_item', {
    //         method: 'POST', // или 'PUT'
    //         body: JSON.stringify({
    //           id: `info__${c.wo}`,
    //           type: 'info',
    //           info: {
    //             wo: c.wo,
    //             'cab name': c['cab name'],
    //             'project number': payload.id,
    //             "Project Name": payload.info.base['Project Name'],
    //             status: payload.status
    //           }
    //         }),
    //       })
    //       if (c.wo) {
    //         console.log('createProjectInfo');

    //         request()
    //       }
    //     })
    //   // })
    // },
    async getCabinetsInfo({ commit }, payload: string) {


      const { request: reqCabinetInfo, response: resCabinetInfo } = useFetch<cabinetInfo>(
        `/api/errors/info__${payload}`
      )
      await reqCabinetInfo()


      // const projects: projectInfoType[] = []
      // const { request, response } = useFetch<projectType[]>(
      //   '/api/projects?status=open'
      // )
      // await request()

      // response.value!.forEach((p) => {
      //   p.cabinets.forEach((c) => {


      //     const { request, response } = useFetch('/api/post_item', {
      //       method: 'POST', // или 'PUT'
      //       body: JSON.stringify({
      //         id: `info__${c.wo}`,
      //         type: 'info',
      //         info: {
      //           wo: c.wo,
      //           'cab name': c['cab name'],
      //           'project number': p.id,
      //           "Project Name": p.info.base['Project Name'],
      //           status: p.status
      //         }
      //       }),
      //     })
      //     if (c.wo) {
      //       // request()
      //     }


      // //     const payload: projectInfoType = {
      // //       ...c,
      // //       ...p.info.base,
      // //       ...p.info.extends,
      // //       'project number': p.id,
      // //     }
      // //     projects.push(payload)
      //   })
      // })
      // const currentInfo = projects.find((e) => e.wo === payload)


      // commit('SETcurrentProject', currentInfo)
      console.log(resCabinetInfo.value!.info, 'resCabinetInfo.value!.info');

      commit('SETcurrentProject', resCabinetInfo.value!.info)
    },
    async GET_cabinetItems({ commit }, payload: string) {
      const { request, response } = useFetch<cabItems[]>(
        `/api/cabinetItems_copy?wo=${payload}`
      )
      await request()
      // debugger
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
