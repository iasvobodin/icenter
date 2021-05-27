import { createStore } from "vuex";

export default createStore({
  state: {
    loader: false,
    template: null,
    projectList: null,
    testState: "testState",
    selectedProjectNumber: "",
    projectInfo: {},
    user: {},
    currentError: null,
  },
  mutations: {
    changeLoader(state, payload){
      state.loader = payload
    },
    SETERROR(state, pay) {
      state.currentError = pay;
    },
    setUserAuth(state, payload:string) {
      // window.sessionStorage.setItem("user", payload);
      state.user.info = JSON.parse(payload);
      // console.info(state.user, "kjhhljvpoweif-20iwpogjsvjsldvnn");
    },
    setUserInfo(state, payload) {
      state.user.userInfo = payload.userInfo;
      console.log(payload,'payload');
      
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
    SETprojectInfo(state, payload) {
      state.projectInfo = {
        "project number": payload.id,
        ...payload.info.base,
        ...payload.info.extends,
      };
      console.log(state.projectInfo, "state.projectInfo");
    },
    SETcabinetInfo(state, payload) {
      state.projectInfo = {
        ...state.projectInfo,
        wo: payload.split('   ')[0],
        'cab name': payload.split('   ')[1]
      };
      console.log(state.projectInfo, "state.projectInfo");
    },
    SET_projectList(state, payload) {
      state.projectList = payload;
    },
  },
  actions: {
    async GET_template({ commit, state }) {
      try {
        if (!state.template) {
          const resposeTemplate = await fetch(
            "/api/templates/templateProject/ver1"
          );
          const template = await resposeTemplate.json();
          commit("setTemplate", template);
        }
      } catch (error) {
        console.log(error, "GETTEMPLATEERROR");
      }
      // console.log(state.template, "state.template");
    },
    async GET_auth({ commit, state }) {
      let clientPrincipal = null;
      let responseUserAuth;
//check auth AAD
try {
   responseUserAuth = await fetch("/.auth/me");   
   if (responseUserAuth.ok) {
    const userAuth = await responseUserAuth.json();
    clientPrincipal = userAuth.clientPrincipal;
   } 
} catch (error) {
  if (import.meta.env.MODE ==='development') {
    clientPrincipal = {
      userId: "cfdf07822f6a49ee960a7b76bceb6f79",
      userDetails: "Ivan.Svobodin@Emerson.com",
      userRoles: ["admin", "anonymous", "authenticated"],
    };
  } else {
    console.log('try auth');
    // window.location.href = '/user'
    window.location.href = '/.auth/login/aad?post_login_redirect_uri=/user'
  }

  // window.open('')
}
clientPrincipal.userDetails = clientPrincipal.userDetails.toLowerCase();
const name =  clientPrincipal.userDetails.split('@')[0].split('.')
let user  = {...clientPrincipal, name : name[0][0].toUpperCase() + '.' + name[1][0].toUpperCase()+ '.'}

const registerUserRes = await fetch(`/api/user/${clientPrincipal.userId}?getRegisterUser=true`)
    //   console.log(responseUserAuth,'responseUserAuth');
     if (registerUserRes.ok) {
      user = await registerUserRes.json()
     } 
    //  if (responseUserAuth.ok) {

    //  } else{
      
    //  }
     //check Register user


// console.log(import.meta.env, 'ENV');


















      // try {
      //   if (!state.user.info) {
      //     responseUser = await fetch("/.auth/me");
      //   }
      //   try {
      //     const payload = await responseUser.json();
      //     clientPrincipal = payload.clientPrincipal;
      //     // console.log(payload, "payload");
      //   } catch (error) {
      //     console.log("Use local user", error.message);
      //     clientPrincipal = {
      //       userId: "cfdf07822f6a49ee960a7b76bceb6f79",
      //       userDetails: "Ivan.Svobodin@Emerson.com",
      //       userRoles: ["admin", "anonymous", "authenticated"],
      //     };
      //   }
      // } catch (error) {
      //   console.log("fetch error", error);
      // }
      // console.log(clientPrincipal,"clientPrincipal");
     
      window.sessionStorage.setItem("user",  JSON.stringify(user));
      !state.user.info && commit("setUserAuth", JSON.stringify(user));

      // try {
      //   const userRes = await fetch(`/api/user/${clientPrincipal.userId}`, {
      //     method: "POST", // или 'PUT'
      //     body: JSON.stringify({
      //       id: clientPrincipal.userId,
      //       type: "info",
      //       info: clientPrincipal,
      //       body: {},
      //     }),
      //   });
      //   const user = await userRes.json();
      //   const name = user.userDetails.split('@')[0].split('.')
      //   !state.user.body && commit("setUserInfo", {...user, name : name[0][0].toUpperCase() + '.' + name[1][0].toUpperCase()+ '.'});
      //   // console.log(state.user,user, "state.user.info");
      // } catch (error) {
      //   console.log("user is not def", error);
      // }

      console.log("GETAUTH");
    },
    async GET_projectList({ commit, state }, payload) {
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