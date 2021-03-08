import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
   plugins: [createPersistedState({ storage: window.sessionStorage })],
   state: {
      game: null,
      username: null,
      isLoggedIn: false,
   },
   mutations: {
      login(state, payload) {
         state.isLoggedIn = true;
         state.username = payload.username;
      },
      logout(state) {
         state.username = null;
         state.isLoggedIn = false;
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
