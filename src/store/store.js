import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const set = property => (store, payload) => (store[property] = payload);

export default new Vuex.Store({
   plugins: [createPersistedState({ storage: window.sessionStorage })],
   state: {
      game: null,
      userId: null,
      username: null,
      userGames: null,
      isLoggedIn: false,
      app_settings: {},
      token: null,
      fbToken: null,
   },
   mutations: {
      selectGame: set('game'),
      setUserId: set('userId'),
      setUsername: set('username'),
      setUserGames: set('userGames'),
      setIsLoggedIn: set('isLoggedIn'),
      setToken: set('token'),
      setFbToken: set('fbToken'),
      setSaveFilters(state, payload) {
         state.app_settings.save_filters = payload;
      },
      login(state, payload) {
         state.isLoggedIn = true;
         state.userId = payload.id;
         state.username = payload.username;
         state.userGames = payload.userGames;
         state.app_settings = payload.app_settings;
         state.token = payload.token;
      },
      logout(state) {
         state.isLoggedIn = false;
         state.userId = null;
         state.username = null;
         state.userGames = null;
         state.app_settings = {};
         state.token = null;
         state.fbToken = null;
      },
      exitGame(state) {
         state.game = null;
      },
      savePageFilters(state, payload) {
         state.app_settings[payload.page] = payload.values;
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
      setEncounters(state, payload) {
         state.game.encounters = payload;
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
});
