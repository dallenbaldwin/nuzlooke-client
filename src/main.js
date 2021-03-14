import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router/router.js';
import store from './store/store.js';
import vuetify from './plugins/vuetify';
import util from './mixins/util.js';

Vue.config.productionTip = false;

Vue.mixin(util);

new Vue({
   router,
   store,
   vuetify,
   render: function(h) {
      return h(App);
   },
}).$mount('#app');
