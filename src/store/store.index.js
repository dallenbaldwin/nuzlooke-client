import Vue from 'vue';
import Vuex from 'vuex';
import { isMobile } from 'mobile-device-detect';

Vue.use(Vuex);

export default new Vuex.Store({
   state: {
      game: {
         name: 'dummy name',
      },
      username: 'dallen.baldwin',
      isLoggedIn: false,
      mobile: isMobile,
      drawer: false,
   },
   mutations: {
      authenticate(state, payload) {
         state.isLoggedIn = true;
         state.username = payload.username;
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
