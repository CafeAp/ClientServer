// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import VueResource from 'vue-resource';
import store from '@/store'
import 'chart.js'
import 'hchs-vue-charts'
Vue.use(VueCharts);
require('@/assets/directives')

Vue.use(VueResource);
require('@/store.js')
Vue.http.options.root = 'http://localhost:3000'
Vue.http.headers.custom['Access-Control-Allow-Origin'] = '*'
Vue.http.headers.common['Access-Control-Allow-Origin'] = '*'
Vue.config.productionTip = false;
/* eslint-disable no-new */

Vue.config.keyCodes = {
  enter: 13
}

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});
