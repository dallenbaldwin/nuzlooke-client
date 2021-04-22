import Vue from 'vue';
import App from './App';
import './registerServiceWorker';
import router from './router/router';
import store from './store/store';
import vuetify from './plugins/vuetify';
import dotenv from 'dotenv';

dotenv.config();

Vue.config.productionTip = false;

import globals from './mixins/globals';
Vue.mixin(globals);

import GoogleAuth from './services/google.js';

Vue.use(GoogleAuth, {
   clientId: process.env.VUE_APP_GOOGLE_CLIENT_ID,
   scope: 'profile email',
   prompt: 'select_account',
});

const startApp = () => {
   new Vue({
      router,
      store,
      vuetify,
      render: function(h) {
         return h(App);
      },
   }).$mount('#app');
};

// have to wait for facebook to start the app
import { initFacebookSDK } from './services/facebook';
initFacebookSDK().then(startApp);
