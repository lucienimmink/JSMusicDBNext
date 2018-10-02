import Vue from 'vue';
import Vuex from 'vuex';

import collection from '@/store/modules/collection';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    collection
  },
  strict: process.env.NODE_ENV !== 'production'
});
