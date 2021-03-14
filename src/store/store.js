import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
   plugins: [createPersistedState({ storage: window.sessionStorage })],
   state: {
      apiURL: `${window.location.protocol}//${window.location.hostname}:3000/api`,
      game: null,
      userId: null,
      username: null,
      userGames: null,
      isLoggedIn: false,
   },
   mutations: {
      login(state, payload) {
         state.isLoggedIn = true;
         state.userId = payload.id;
         state.username = payload.username;
         state.userGames = payload.games;
      },
      logout(state) {
         state.isLoggedIn = false;
         state.userId = null;
         state.username = null;
         state.userGames = null;
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
