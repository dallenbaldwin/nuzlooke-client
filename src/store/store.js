import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
   plugins: [createPersistedState({ storage: window.sessionStorage })],
   state: {
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
      deleteExistingRuleByLabel(state, payload) {
         const i = state.game.game_rules.findIndex(r => r.label === payload.label);
         if (i !== -1) state.game.game_rules.splice(i, 1);
      },
      deleteExistingRuleById(state, payload) {
         const i = state.game.game_rules.findIndex(r => r.id === payload.id);
         if (i !== -1) state.game.game_rules.splice(i, 1);
      },
      updateRuleById(state, payload) {
         const i = state.game.game_rules.findIndex(r => r.id === payload.id);
         if (i !== -1) state.game.game_rules.splice(i, 1, payload.rule);
      },
      updateRuleByLabel(state, payload) {
         const i = state.game.game_rules.findIndex(r => r.label === payload.label);
         if (i !== -1) state.game.game_rules.splice(i, 1, payload.rule);
      },
      addNewRule(state, payload) {
         state.game.game_rules.push(payload);
      },
      earnedBadge(state, payload) {
         const i = state.game.gyms.findIndex(g => g.sort_id === payload.sort_id);
         if (i !== -1) state.game.gyms.splice(i, 1, payload);
      },
      updateGameLabel(state, payload) {
         let userGame = state.userGames.find(ug => ug.game_id === payload.gameId);
         userGame.label = payload.label;
      },
      finishGame(state, payload) {
         let userGame = state.userGames.find(ug => ug.game_id === payload);
         userGame.is_finished = true;
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
