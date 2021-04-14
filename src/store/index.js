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
    setUserAuth(state, payload) {
      window.sessionStorage.setItem("userDetails", payload.userDetails);
      state.user.authInfo = payload;
      console.info(state.user, "kjhhljvpoweif-20iwpogjsvjsldvnn");
    },
    setUserInfo(state, payload) {
      state.user.userInfo = payload.userInfo;
      console.log(state.user, "state.user");
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
    async GET_auth({ commit, state }) {
      let clientPrincipal = null;
      let responseUser;

      try {
        if (!state.user.authInfo) {
          responseUser = await fetch("/.auth/me");
        }
        try {
          const payload = await responseUser.json();
          clientPrincipal = payload.clientPrincipal;
          // console.log(payload, "payload");
        } catch (error) {
          console.log("Use local user", error.message);
          clientPrincipal = {
            userId: "LOCALUSERID",
            userDetails: "local@mail.com",
          };
        }
      } catch (error) {
        console.log("fetch error", error);
      }
      // console.log(clientPrincipal,"clientPrincipal");
      !state.user.authInfo && commit("setUserAuth", clientPrincipal);

      try {
        const userRes = await fetch(`/api/user/${clientPrincipal.userId}`, {
          method: "POST", // или 'PUT'
          body: JSON.stringify({
            id: clientPrincipal.userId,
            type: "info",
            authInfo: clientPrincipal,
            userInfo: {},
          }),
        });
        const user = await userRes.json();
        !state.user.userInfo && commit("setUserInfo", user);
        // console.log(state.user,user, "state.user.info");
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
