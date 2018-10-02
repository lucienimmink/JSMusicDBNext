import rest from './../../rest/gateway';
import core from './../../shared/js/db';

const state = {
  collection: {},
  loading: true
};
const getters = {
  collection: s => s.collection,
  loading: s => s.loading,
  getActiveLetterById: s => id => s.collection.letters[id],
  getActiveArtistById: s => id => s.collection.artists[id.toUpperCase()]
};
const actions = {
  get({ commit }) {
    commit('setCollection', {});
    rest
      .getCollection()
      .then((collection) => {
        // parse collection update types
        const parsedCollection = core.getCollection(collection);
        commit('setCollection', parsedCollection);
      })
      .catch(() => {
        // console.log('error getting collection', e);
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
