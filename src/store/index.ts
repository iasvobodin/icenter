import {
  createStore
} from "vuex";
const createName = (clientPrincipal) =>{
  const splitName = clientPrincipal.userDetails.split('@')[0].split('.')
  const name = splitName[0][0].toUpperCase() + '.' + splitName[1][0].toUpperCase() + '.'
  return name
}
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
    changeLoader(state, payload) {
      state.loader = payload
    },
    SETERROR(state, pay) {
      state.currentError = pay;
    },
    setUserAuth(state, payload: string) {
      // window.sessionStorage.setItem("user", payload);
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
    async GET_template({
      commit,
      state
    }) {
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
    async checkUser({
      commit,
      state
    }) {
      const registerUserRes = await fetch(`/api/user/${state.user.id}?getRegisterUser=true`)
      let user;//   console.log(responseUserAuth,'responseUserAuth');
      if (registerUserRes.ok) {
        user = await registerUserRes.json()
        const name = createName(state.user.info)
        user.body.name = name
      const LSuser = window.sessionStorage.getItem("user");

      if (JSON.stringify(user) !== LSuser) {
        console.log('check user version');
        commit("setUserAuth", JSON.stringify(user));
        window.sessionStorage.setItem("user", JSON.stringify(user))
      }
      state.user.body&&document.documentElement.style.setProperty('--bg', `${state.user.body.bg}`);

    }
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
          userId: "cfdf07822f6a49ee960a7b76bceb6f79",
          userDetails: "Ivan.Svobodin@Emerson.com",
          userRoles: ["admin", "anonymous", "authenticated"],
        };
      } else {
        console.log('try auth');
        responseUserAuth = await fetch("/.auth/me");
        const userAuth = await responseUserAuth.json();
        clientPrincipal = userAuth.clientPrincipal;
        if (!clientPrincipal) {
          window.location.href = '/.auth/login/aad?post_login_redirect_uri=/user'
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
          window.sessionStorage.setItem("user", JSON.stringify(user));
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
        window.sessionStorage.setItem("user", JSON.stringify(user));
        commit("setUserAuth", JSON.stringify(user));
      }



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


      // console.log(user,);

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