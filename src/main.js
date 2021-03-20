import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router/router.js';
import store from './store/store.js';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

import UtilMixin from './mixins/UtilMixin';
Vue.mixin(UtilMixin);

new Vue({
   router,
   store,
   vuetify,
   render: function(h) {
      return h(App);
   },
}).$mount('#app');
