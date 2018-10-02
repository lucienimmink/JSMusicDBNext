import Vue from 'vue';
import App from './app.vue';
import './registerServiceWorker';
import 'primer-base/index.scss';

Vue.config.productionTip = process.env.NODE_ENV !== 'production';

new Vue({
  render: h => h(App)
}).$mount('#app');
