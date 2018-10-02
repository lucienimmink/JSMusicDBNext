import Vue from 'vue';
import 'primer-base/index.scss';
import axios from 'axios';
import VueAxios from 'vue-axios';

import App from './app.vue';
import store from '@/store';
import './registerServiceWorker';

Vue.config.productionTip = process.env.NODE_ENV !== 'production';

// set-up axios
axios.interceptors.response.use(
  response => response,
  (error) => {
    if (error.response.status === 401) {
      // redirect to the login (for now we replace the word portal by login; and skip the path please (though we could use that in the future for deep-link purpose)
      // TODO
    }
    return Promise.reject(error);
  }
);

Vue.use(VueAxios, axios);

new Vue({
  render: h => h(App),
  store
}).$mount('#app');
