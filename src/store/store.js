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
      setUserGames(state, payload) {
         state.userGames = payload;
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
      updateEncounterById(state, payload) {
         const i = state.game.encounters.findIndex(e => e.id === payload.id);
         if (i !== -1) state.game.encounters.splice(i, 1, payload);
      },
      updatePokemonById(state, payload) {
         const i = state.game.pokemons.findIndex(p => p.id === payload.id);
         if (i !== -1) state.game.pokemons.splice(i, 1, payload);
      },
      pushNewPokemon(state, payload) {
         state.game.pokemons.push(payload);
      },
      updateGameSnapshot(state, payload) {
         const i = state.userGames.findIndex(g => g.id === payload.id);
         if (i !== -1) state.userGames.splice(i, 1, payload);
      },
   },
   actions: {
      authenticate(context, payload) {
         context.commit('authenticate', payload);
      },
   },
});
