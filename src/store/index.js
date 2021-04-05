import { createStore } from "vuex";

export default createStore({
  state: {
    projectList: null,
    testState: "testState",
    selectedProjectNumber: "",
    projectInfo: {},
    user:{}
  },
  mutations: {
    SETuser(state, payload){
      // let data = sessionStorage.getItem('mail');
      // !data&&
      window.sessionStorage.setItem('mail', payload.userDetails);
      state.user.mail = sessionStorage.getItem('mail');
      console.log(sessionStorage.getItem('mail'));
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
        ...payload.info.extends
      };
    },
    SETcabinetInfo(state, payload) {
      state.projectInfo = {
        ...state.projectInfo,
        ...payload
      };
      console.log(state.projectInfo, "state.projectInfo");
    },
    SET_projectList(state, payload) {
      state.projectList = payload;
    }
  },
  actions: {
    async GET_projectList({ commit, state }, payload) {
      let data;
      !state.projects.List &&
        (data = await (
          await fetch(`${payload}${state.selectedProjectNumber}`)
        ).json());
      // console.log(data, "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      commit("SET_projectList", data);
    }
  },
  modules: {}
});
