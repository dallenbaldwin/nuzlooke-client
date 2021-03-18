import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router/router.js';
import store from './store/store.js';
import vuetify from './plugins/vuetify';
import UtilMixin from './mixins/UtilMixin.js';

Vue.config.productionTip = false;

Vue.mixin(UtilMixin);

new Vue({
   router,
   store,
   vuetify,
   render: function(h) {
      return h(App);
   },
}).$mount('#app');
