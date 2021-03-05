import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
   debug: true,
   state: {
      game: null,
      username: 'dallen.baldwin',
      isLoggedIn: false,
   },
   mutations: {
      authenticate() {
         if (this.debug) console.log('authenticate');
         this.isLoggedIn = true;
      },
   },
});
