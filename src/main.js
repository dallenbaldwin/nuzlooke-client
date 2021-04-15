import Vue from 'vue';
import App from './App';
import './registerServiceWorker';
import router from './router/router';
import store from './store/store';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

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
