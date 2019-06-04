import Vue from 'vue';
import App from './App.vue';
import Vuetify from 'vuetify';

import 'vuetify/dist/vuetify.min.css';
import './assets/css/app.css';

Vue.use(Vuetify);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
