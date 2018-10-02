const state = {
  activeLetter: null
};
const getters = {
  activeLetter: s => s.activeLetter
};
const actions = {
  setActive({ commit }, letter) {
    commit('setActive', letter);
  }
};
const mutations = {
  setActive(s, letter) {
    s.activeLetter = letter;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
