import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueRouter from 'vue-router';
import 'primer-base/index.scss';

import App from '@/app.vue';
import store from '@/store';
import routes from '@/routes';
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
// set-up router
const router = new VueRouter({
  mode: 'history',
  routes
});

Vue.use(VueRouter);
Vue.use(VueAxios, axios);

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app');
