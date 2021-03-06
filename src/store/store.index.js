import Vue from 'vue';
import Vuex from 'vuex';
import { isMobile } from 'mobile-device-detect';

Vue.use(Vuex);

export default new Vuex.Store({
   state: {
      game: null,
      username: null,
      isLoggedIn: false,
      mobile: isMobile,
      drawer: false,
   },
   mutations: {
      authenticate(state, payload) {},
      login(state, payload) {
         state.isLoggedIn = true;
         state.username = payload.username;
      },
      logout(state) {
         state.username = null;
         state.isLoggedIn = false;
      },
      drawer(state) {
         state.drawer = !state.drawer;
      },
      selectGame(state, payload) {
         state.game = payload;
      },
      exitGame(state) {
         state.game = null;
      },
   },
   actions: {
      authenticate(context, payload) {
         context.commit('authenticate', payload);
      },
   },
});
