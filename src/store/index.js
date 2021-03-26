import { createStore } from "vuex";

export default createStore({
  state: {
    projects: {},
    testState: "testState"
  },
  mutations: {
    SET_projectList(state, payload) {
      state.projects.List = payload.filter(el => el.length > 6).sort();
      // payload.filter(el => el.length > 6).sort().forEach(el => {
      //   state.projectList.push(el)
      // });
      // console.log(Object.values(state.projects.List));
    }
  },
  actions: {
    async GET_projectList({ commit, state }) {
      let data;
      !state.projects.List &&
        (data = await (await fetch(`/api/projectstatus/Open`)).json());
      commit("SET_projectList", data);
    }
  },
  modules: {}
});
