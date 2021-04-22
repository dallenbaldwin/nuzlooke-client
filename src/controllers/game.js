import PartyState from '../constants/PartyState';
import store from '../store/store';
import * as services from '../services/game';
import * as util from '../util/util';
import Game from '../models/Game';
import APIResponse from '../models/APIResponse';
import * as userController from '../controllers/user';
import GameVersions from '../constants/GameVersions';
import GameSnapshot from '../models/GameSnapshot';
import GameRules from '../constants/GameRules';
import Pages from '../constants/Pages';

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
   let rules = options.rules.map(r => r.values).filter(r => !util.isUndefined(r));
   if (rules.length !== options.rules.length && !isEdit)
      errors.push('A Pre-defined Rule is missing a selection!');
   let set = new Set();
   rules.forEach(rule => {
      set.add(rule.value);
   });
   if (set.size !== rules.length && !isEdit)
      errors.push('You cannot have two of the same Pre-defined Rule!');
   return {
      errors: errors,
      hasErrors: errors.length > 0,
   };
};

export const createNewGame = async (label, version, rules) => {
   // TODO rework to create the game, then ask for the routes, possibly in a loop??
   try {
      const newRules = rules.map(rule => {
         let defaultRule = Object.values(GameRules).find(gr => gr.id === rule);
         defaultRule.is_active = true;
         return defaultRule;
      });
      const newGame = Game.builder()
         .withLabel(label)
         .withVersion(version)
         .withGameRules(newRules)
         .build();
      const res = await services.createGame(newGame);
      const createdGame = APIResponse.fromResponse(res).data;
      const gameSnapshot = getSnapshot(createdGame);
      userController.addGameSnapshot(gameSnapshot);
      await userController.updateUserGames();
      await goToGame(createdGame.id, util.mobile() ? 'routes' : '0');
   } catch (err) {
      alert(util.errorCatch(err));
   }
};

export const updateGameRulesInDB = async game => {
   try {
      await services.updateGameById(game.id, { game_rules: game.game_rules });
   } catch (err) {
      alert(util.errorCatch(err));
   }
};

export const goToGame = async (gameId, route) => {
   const res = await services.getGameById(gameId);
   const game = APIResponse.fromResponse(res).data;
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

export const exitGame = () => {
   store.commit('exitGame');
   util.navigate({ name: Pages.GAMES });
};
