import rest from '@/rest/gateway';
import core from '@/shared/js/db';

const state = {
  collection: {},
  loading: true
};
const getters = {
  getCollection: s => s.collection,
  loading: s => s.loading
};
const actions = {
  get({ commit }) {
    rest
      .getCollection()
      .then((collection) => {
        // parse collection update types
        const parsedCollection = core.getCollection(collection);
        commit('setCollection', parsedCollection);
      })
      .catch((e) => {
        console.log('error getting collection', e);
      });
  }
};
const mutations = {
  setCollection(s, collection) {
    s.collection = collection;
    s.loading = false;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
