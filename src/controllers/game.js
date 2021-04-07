import PartyState from '../constants/PartyState';
import store from '../store/store';
import * as services from '../services/game';
import * as util from '../util/util';
import NewGame from '../models/NewGame';
import APIResponse from '../models/APIResponse';
import * as userController from '../controllers/user';
import GameVersions from '../constants/GameVersions';
import GameSnapshot from '../models/GameSnapshot';

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

export const updateGymsInDB = async () => {
   try {
      const res = await services.updateGameById(store.state.game.id, {
         gyms: store.state.game.gyms,
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

export const finishGame = async gameId => {
   store.commit('finishGame', gameId);
   await userController.updateUserGames();
   await services.updateGameById(gameId, { is_finished: true });
};

export const updateGameLabel = async (gameId, label) => {
   store.commit('updateGameLabel', { gameId: gameId, label: label });
   await userController.updateUserGames();
   await services.updateGameById(gameId, { label: label });
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

export const getSnapshot = game => {
   return GameSnapshot.builder()
      .withGameId(game.id)
      .withGymBadgeIconUrls(getGymBadgeIconsUrls(game))
      .withIsFinished(game.is_finished)
      .withLabel(game.label)
      .withPartyIconUrls(getPartyIconUrls(game))
      .withVersion(game.version)
      .build();
};
