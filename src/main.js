import Vue from 'vue';
import App from './App';
import './registerServiceWorker';
import router from './router/router';
import store from './store/store';
import vuetify from './plugins/vuetify';

import dotenv from 'dotenv';
dotenv.config();

import globals from './mixins/globals';
Vue.mixin(globals);

new Vue({
   router,
   store,
   vuetify,
   render: function(h) {
      return h(App);
   },
}).$mount('#app');
