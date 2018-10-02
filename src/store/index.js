import Vue from 'vue';
import Vuex from 'vuex';

import collection from '@/store/modules/collection';
import letter from '@/store/modules/letter';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    collection,
    letter
  },
  strict: process.env.NODE_ENV !== 'production'
});
