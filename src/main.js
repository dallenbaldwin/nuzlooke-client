import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router/router.index';
import store from './store/store.index';
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
