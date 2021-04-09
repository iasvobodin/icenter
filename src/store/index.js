import { createStore } from "vuex";

export default createStore({
  state: {
    projectList: null,
    testState: "testState",
    selectedProjectNumber: "",
    projectInfo: {},
    user: {},
  },
  mutations: {
    SETuser(state, payload) {
      // let data = sessionStorage.getItem('mail');
      // !data&&
      window.sessionStorage.setItem("mail", payload.userDetails);
      state.user.mail = sessionStorage.getItem("mail");
      console.log(sessionStorage.getItem("mail"));
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
        ...payload,
      };
      console.log(state.projectInfo, "state.projectInfo");
    },
    SET_projectList(state, payload) {
      state.projectList = payload;
    },
  },
  actions: {
    async GET_auth({ commit }) {
      let clientPrincipal = null;

      try {
        const response = await fetch("/.auth/me");
        try {
          const payload = await response.json();
          clientPrincipal = payload.clientPrincipal;
          console.log(payload, "payload");
        } catch (error) {
          console.log("json error", error);
          clientPrincipal = {
            userId: "zzaaqq",
            userDetails: "local@mail.com",
          };
        }
      } catch (error) {
        console.log("fetch error", error);
      }
      commit("SETuser", clientPrincipal);

      try {
        await fetch(`/api/user/${clientPrincipal.userId}`, {
          method: "POST", // или 'PUT'
          body: JSON.stringify({
            id: clientPrincipal.userId,
            type: "info",
            authInfo: clientPrincipal,
            userInfo: {},
          }),
        });
      } catch (error) {
        console.log("user is not def", error);
      }
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
