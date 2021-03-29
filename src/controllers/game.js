import Versions from '../constants/Versions.js';
import PartyState from '../constants/PartyState.js';
import Icons from '../constants/Icons.js';
import store from '../store/store.js';
import * as services from '../services/game.js';
import * as util from '../util/util.js';
import NewGame from '../models/NewGame.js';
import APIResponse from '../models/APIResponse.js';
import * as userController from '../controllers/user.js';

export const updateEncountersAndPokemonsInDB = async () => {
   try {
      await services.updateGameById(store.state.game.id, {
         pokemons: store.state.game.pokemons,
         encounters: store.state.game.encounters,
      });
   } catch (err) {
      alert(util.errorCatch(err));
   }
};

export const getValidationErrors = (options, isEdit = false) => {
   const errors = [];
   if (util.isUndefined(options.label))
      errors.push('You must give this playthrough a Name!');
   if (util.isUndefined(options.version) && !isEdit)
      errors.push('You must select a Version!');
   return {
      errors: errors,
      hasErrors: errors.length > 0,
   };
};

export const createNewGame = async (label, version, rules) => {
   try {
      const newGame = NewGame.builder()
         .withLabel(label)
         .withVersion(version)
         // .withRules(...rules)
         .build();
      const res = await services.createGame(newGame);
      const createdGame = new APIResponse(res).data;
      const gameSnapshot = getSnapshot(createdGame);
      userController.addGameSnapshot(gameSnapshot);
      await userController.updateUserGames();
      await goToGame(createdGame.id, util.mobile() ? 'routes' : '0');
   } catch (err) {
      alert(util.errorCatch(err));
   }
};

export const goToGame = async (gameId, route) => {
   const res = await services.getGameById(gameId);
   const game = new APIResponse(res).data;
   store.commit('selectGame', game);
   if (util.mobile()) util.navigate({ name: route, params: { gameId: game.id } });
   else util.navigate({ name: 'game', params: { gameId: game.id, tab: route } });
};

export const deleteExistingGame = async gameId => {
   store.commit('deleteExistingGame', gameId);
   await services.deleteGameById(gameId);
   await userController.updateUserGames();
};

export const updateGameLabel = async (gameId, label) => {
   store.commit('updateGameLabel', { gameId: gameId, label: label });
   await userController.updateUserGames();
   // debugger;
   await services.updateGameById(gameId, { label: label });
};

export const getConsoleIcon = family => {
   const familyToConsole = {
      letsgo: Icons.CONSOLES.SWITCH,
      rubysapphire: Icons.CONSOLES.DEFAULT,
      emerald: Icons.CONSOLES.DEFAULT,
   };
   return familyToConsole[family];
};

export const getPartyIconUrls = game =>
   game.pokemons.filter(p => p.party_state === PartyState.PARTY).map(p => p.icon_url);

export const getGymBadgeIconsUrls = game =>
   game.gyms.filter(g => g.is_defeated).map(g => g.badge.sprite_url);

export const getSnapshot = game => {
   return {
      game_id: game.id,
      is_finished: game.is_finished,
      label: game.label,
      version: game.version,
      party_icon_urls: getPartyIconUrls(game),
      gym_badge_icon_urls: getGymBadgeIconsUrls(game),
   };
};
