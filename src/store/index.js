import { createStore } from "vuex";

export default createStore({
  state: {
    projectList: null,
    testState: "testState",
    selectedProjectNumber: "",
    projectInfo:{}
  },
  mutations: {
    SETprojectNumber(state, payload) {
      state.selectedProjectNumber = payload
      console.log(state.selectedProjectNumber,"this.$store.state.selectedProjectNumber");

    },
    SET_projectList(state, payload) {
      state.projectList = payload;
    }
  },
  actions: {
    async GET_projectList({ commit, state }, payload) {
      let data;
      !state.projects.List &&
        (data = await (await fetch(`${payload}${state.selectedProjectNumber}`)).json());
        // console.log(data, "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      commit("SET_projectList", data);
    }
  },
  modules: {}
});
