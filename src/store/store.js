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
      setUsername(state, payload) {
         state.username = payload;
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
      earnedBadge(state, payload) {
         const i = state.game.gyms.findIndex(g => g.sort_id === payload.sort_id);
         if (i !== -1) state.game.gyms.splice(i, 1, payload);
      },
      updateGameLabel(state, payload) {
         let userGame = state.userGames.find(ug => ug.game_id === payload.gameId);
         userGame.label = payload.label;
      },
      deleteExistingGame(state, payload) {
         const i = state.userGames.findIndex(g => g.game_id === payload);
         if (i !== -1) state.userGames.splice(i, 1);
      },
      addGameSnapshot(state, payload) {
         state.userGames.push(payload);
      },
      updateEncounter(state, payload) {
         const i = state.game.encounters.findIndex(e => e.id === payload.id);
         if (i !== -1) state.game.encounters.splice(i, 1, payload);
      },
      updatePokemon(state, payload) {
         const i = state.game.pokemons.findIndex(p => p.id === payload.id);
         if (i !== -1) state.game.pokemons.splice(i, 1, payload);
      },
      pushNewPokemon(state, payload) {
         state.game.pokemons.push(payload);
      },
      updateGameSnapshot(state, payload) {
         const i = state.userGames.findIndex(g => g.game_id === payload.game_id);
         if (i !== -1) state.userGames.splice(i, 1, payload);
      },
      removePokemonFromPokemons(state, payload) {
         const i = state.game.pokemons.findIndex(p => p.id === payload.id);
         if (i !== -1) state.game.pokemons.splice(i, 1);
      },
   },
   actions: {
      authenticate(context, payload) {
         context.commit('authenticate', payload);
      },
   },
});
