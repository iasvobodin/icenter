import {
  createStore
} from "vuex";
import {
  useFetch
} from '@/hooks/fetch'
const createName = (clientPrincipal) =>{
  if (clientPrincipal.identityProvider === 'aad') {
    const splitName = clientPrincipal.userDetails.split('@')[0].split('.')
    const name = splitName[0][0].toUpperCase() + '.' + splitName[1][0].toUpperCase() + '.'
    return name
  } return clientPrincipal.userDetails.split('@')[0]

}
export default createStore({
  state: {
    loader: false,
    template: null,
    projectList: null,
    testState: "testState",
    selectedProjectNumber: "",
    projectInfo: null,
    user: {},
    currentError: null,
    cabinetItems:[]
  },
  mutations: {
    SET_cabinetItems(state, payload){
      state.cabinetItems = payload
    },
    changeLoader(state, payload) {
      state.loader = payload
    },
    SETERROR(state, pay) {
      state.currentError = pay;
    },
    setUserAuth(state, payload: string) {
      // window.localStorage.setItem("user", payload);
      state.user = JSON.parse(payload);
      // console.info(state.user, "kjhhljvpoweif-20iwpogjsvjsldvnn");
    },
    setUserInfo(state, payload) {
      state.user.userInfo = payload.userInfo;
      console.log(payload, 'payload');

      // console.log(state.user, "state.user");
    },

    setTemplate(state, payload) {
      state.template = payload;
    },

    SETprojectNumber(state, payload) {
      state.selectedProjectNumber = payload;
      console.log(
        state.selectedProjectNumber,
        "this.$store.state.selectedProjectNumber"
      );
    },
    SETcurrentProject(state, payload) {
      state.projectInfo = payload;
      // console.log(state.projectInfo, "state.projectInfo");
    },
    SETprojectInfo(state, payload) {
      state.projectInfo = {
        "project number": payload.id,
        ...payload.info.base,
        ...payload.info.extends,
      };
      // console.log(state.projectInfo, "state.projectInfo");
    },
    SETcabinetInfo(state, payload) {
      state.projectInfo = {
        ...state.projectInfo,
        wo: payload.split('   ')[0],
        'cab name': payload.split('   ')[1]
      };
      // console.log(state.projectInfo, "state.projectInfo");
    },
    SET_projectList(state, payload) {
      state.projectList = payload;
    },
  },
  actions: {
    async getCabinetsInfo ({ commit }, payload) {
      const projects = [];
      const { request, response } = useFetch('/api/projects?status=open')
      await request()
      response.value.forEach(p =>{
          p.cabinets.forEach(c=>{
              let payload = {
                  "project number": p.id,
                  ...c,
                  ...p.info.base,
                  ...p.info.extends,
              }
              projects.push(payload)
          })
      }) 
    const currentInfo = projects.find(e => e.wo === payload)
    commit('SETcurrentProject', currentInfo)
    // console.log(projects);
    },
    async GET_cabinetItems({ commit }, payload) {
      const { request, response } = useFetch(
        `/api/cabinetItems?wo=${payload}`,
    )
    await request()

    commit('SET_cabinetItems', response.value)

    },
    async GET_template({
      commit,
      state
    }) {
      console.log("GET TEMPLATE");

        !state.loader&&commit("changeLoader", true);

        try {
          const resposeTemplate = await fetch(
            "/api/templates/templateProject/ver1"
          );
          const template = await resposeTemplate.json();
          commit("setTemplate", template);
          commit("changeLoader", false);
        } catch (error) {
          console.log(error, "GETTEMPLATEERROR");
        }
    },
    async checkUser({
      commit,
      state
    }) {
      console.log('checking User frome vuex');
      
      const registerUserRes = await fetch(`/api/user/${state.user?.id}?getRegisterUser=true`)
      if (registerUserRes.ok) {
      const userFromServer = await registerUserRes.json()
      const userFromLocal = window.localStorage.getItem("user");
      if (JSON.stringify(userFromServer) !== userFromLocal){
        commit("setUserAuth", JSON.stringify(userFromServer));
        window.localStorage.setItem("user", JSON.stringify(userFromServer))
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
    async GET_auth({
      commit,
      state
    }) {
      let clientPrincipal = null;
      let responseUserAuth;
      //check auth AAD
      if (
        import.meta.env.MODE === 'development') {
          clientPrincipal = {
          identityProvider: "static",
          userId: "9c0c1980f5904d10b43e552d2b7c4041",
          userDetails: "Ivan.Svobodin@Emerson.com",
          userRoles: ["admin","anonymous", "icenter", "authenticated"],
        };
      } else {
        console.log('try auth');
        responseUserAuth = await fetch("/.auth/me");
        const userAuth = await responseUserAuth.json();
        clientPrincipal = userAuth.clientPrincipal;
        // if(!clientPrincipal) return
        if (!clientPrincipal&&!window.location.toString().includes('login')) {
          window.location.href = '/login'
          return
        }
      }
      console.log(clientPrincipal, "clientPrincipal after check auth");
      clientPrincipal.userDetails = clientPrincipal.userDetails.toLowerCase();
      // const splitName = clientPrincipal.userDetails.split('@')[0].split('.')
      // const name = splitName[0][0].toUpperCase() + '.' + splitName[1][0].toUpperCase() + '.'
      
      const name = createName(clientPrincipal)
      
      let user = {
        ...clientPrincipal,
        // name
      }

      try {
        const registerUserRes = await fetch(`/api/user/${clientPrincipal.userId}?getRegisterUser=true`)
        //   console.log(responseUserAuth,'responseUserAuth');
        if (registerUserRes.ok) {
          user = await registerUserRes.json()
          user.body.name = name
          window.localStorage.setItem("user", JSON.stringify(user));
          commit("setUserAuth", JSON.stringify(user));
        }
      } catch (error) {
        user = {
          id: clientPrincipal.userId,
          type: "info",
          info: clientPrincipal,
          body: {name},
        }
        const options = {
          method: "POST", // или 'PUT'
          body: JSON.stringify(user)
        }
        await fetch(`/api/user/${clientPrincipal.userId}?postRegisterUser=true`, options)
        window.localStorage.setItem("user", JSON.stringify(user));
        commit("setUserAuth", JSON.stringify(user));
      }

      console.log("GETAUTH");
    },
    async GET_projectList({
      commit,
      state
    }, payload) {
      let data;
      !state.projects.List &&
        (data = await (
          await fetch(`${payload}${state.selectedProjectNumber}`)
        ).json());
      // console.log(data, "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      commit("SET_projectList", data);
    },
  },
  modules: {},
});