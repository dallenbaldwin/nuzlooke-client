import PartyState from '../constants/PartyState';
import store from '../store/store';
import * as services from '../services/game';
import * as util from '../util/util';
import Game from '../models/Game';
import * as userController from '../controllers/user';
import GameVersions from '../constants/GameVersions';
import GameSnapshot from '../models/GameSnapshot';
import GameRules from '../constants/GameRules';
import Pages from '../constants/Pages';
import TabMap from '../constants/TabMap';
import { getEncountersByVersion } from '../services/encounters';

// TODO handle errors
export const updateEncountersAndPokemonsInDB = async () => {
   const response = await services.updateGameById(store.state.game.id, {
      pokemons: store.state.game.pokemons,
      encounters: store.state.game.encounters,
   });
   if (response && response.errors) return response;
};

// TODO handle errors
export const updateGymsInDB = async () => {
   const response = await services.updateGameById(store.state.game.id, {
      gyms: store.state.game.gyms,
   });
   if (response && response.errors) return response;
};

export const getValidationErrors = (options, isEdit = false) => {
   const errors = [];
   if (util.isUndefined(options.label))
      errors.push('You must give this playthrough a Name');
   if (util.isUndefined(options.version) && !isEdit)
      errors.push('You must select a Version');
   if (!isEdit) {
      let rules = options.rules.map(r => r.values).filter(r => !util.isUndefined(r));
      if (rules.length !== options.rules.length && !isEdit)
         errors.push('A Pre-defined Rule is missing a selection');
      let set = new Set();
      rules.forEach(rule => {
         set.add(rule.value);
      });
      if (set.size !== rules.length && !isEdit)
         errors.push('You cannot have two of the same Pre-defined Rule');
   }
   if (errors.length > 0) return { errors: errors };
};

export const createGame = async (label, version, rules) => {
   // get encounters first in order to prevent rogue game creation ~40s max
   const encountersResponse = await getEncountersByVersion(version);
   if (encountersResponse && encountersResponse.errors) return encountersResponse;
   // create game
   const newRules = rules.map(rule => {
      let defaultRule = Object.values(GameRules).find(gr => gr.id === rule);
      defaultRule.is_active = true;
      return defaultRule;
   });
   const createResponse = await services.createGame(
      Game.builder()
         .withLabel(label)
         .withVersion(version)
         .withGameRules(newRules)
         .build()
   );
   if (createResponse && createResponse.errors) return createResponse;
   const createdGame = createResponse.data;
   // update game in database with encounters
   const updateResponse = await services.updateGameById(createdGame.id, {
      encounters: encountersResponse.data,
   });
   if (updateResponse && updateResponse.errors) return updateResponse;
   // update user snapshot
   const gameSnapshot = buildSnapshot(createdGame);
   userController.addGameSnapshot(gameSnapshot);
   const updateGameResponse = await userController.updateUserGames();
   if (updateGameResponse && updateGameResponse.errors) return updateGameResponse;
   // go into the game
   const goToResponse = await goToGame(
      createdGame.id,
      util.mobile() ? Pages.RULES : TabMap.RULES
   );
   if (goToResponse && goToResponse.errors) return goToResponse;
};

// TODO handle errors
export const updateGameRulesInDB = async game => {
   const response = await services.updateGameById(game.id, {
      game_rules: game.game_rules,
   });
   if (response && response.errors) return response;
};

export const goToGame = async (gameId, route) => {
   const response = await services.getGameById(gameId);
   if (response && response.errors) return response;
   const game = response.data;
   store.commit('selectGame', game);
   if (util.mobile()) util.navigate({ name: route, params: { gameId: game.id } });
   else util.navigate({ name: 'game', params: { gameId: game.id, tab: route } });
};

export const deleteExistingGame = async gameId => {
   store.commit('deleteExistingGame', gameId);
   const deleteResponse = await services.deleteGameById(gameId);
   if (deleteResponse && deleteResponse.errors) return deleteResponse;
   const updateResponse = await userController.updateUserGames();
   if (updateResponse && updateResponse.errors) return updateResponse;
};

export const finishGame = async gameId => {
   store.commit('finishGame', gameId);
   const updateUGResponse = await userController.updateUserGames();
   if (updateUGResponse && updateUGResponse.errors) return updateUGResponse;
   const updateGResponse = await services.updateGameById(gameId, { is_finished: true });
   if (updateGResponse && updateGResponse.errors) return updateGResponse;
};

export const updateGameLabel = async (gameId, label) => {
   store.commit('updateGameLabel', { gameId: gameId, label: label });
   const updateUGResponse = await userController.updateUserGames();
   if (updateUGResponse && updateUGResponse.errors) return updateUGResponse;
   const updateGResponse = await services.updateGameById(gameId, { label: label });
   if (updateGResponse && updateGResponse.errors) return updateGResponse;
};

export const getConsoleIcon = family => {
   const icons = Object.values(GameVersions).map(v =>
      Object({ family: v.version_group, icon: v.icon })
   );
   return icons.find(i => i.family === family).icon;
};

export const getPartyIconUrls = game =>
   game.pokemons.filter(p => p.party_state === PartyState.PARTY).map(p => p.icon_url);

export const getGymBadgeIconsUrls = game =>
   game.gyms.filter(g => g.is_defeated).map(g => g.badge.sprite_url);

export const buildSnapshot = game => {
   return GameSnapshot.builder()
      .withGameId(game.id)
      .withGymBadgeIconUrls(getGymBadgeIconsUrls(game))
      .withIsFinished(game.is_finished)
      .withLabel(game.label)
      .withPartyIconUrls(getPartyIconUrls(game))
      .withVersion(game.version)
      .build();
};

export const exitGame = () => {
   store.commit('exitGame');
   util.navigate({ name: Pages.GAMES });
};
