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
// FIXME this needs to be an env variable in netlify
Vue.use(GoogleAuth, {
   clientId: '117152946095-d8n9qdlm3p78k8u6arfgd7so2mva2qov.apps.googleusercontent.com',
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
