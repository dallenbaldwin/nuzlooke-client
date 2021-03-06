import store from '../store/store';
import GameRules from '../constants/GameRules';
import EncounterResultConst from '../constants/EncounterResultConst';
import * as util from '../util/util';
import * as rulesController from '../controllers/rules';
import * as pokemonController from '../controllers/pokemon';

export const getEncounterById = id => {
   return store.state.game.encounters.find(e => id === e.id);
};

export const getRouteByPokemonId = id => {
   return store.state.game.encounters.find(e => e.result.pokemon_id === id);
};

export const updateEncounterInStore = encounter => {
   store.commit('updateEncounter', { encounter: encounter });
};

export const isAvailable = constant => constant === EncounterResultConst.AVAILABLE;

export const isCaught = constant => constant === EncounterResultConst.CAUGHT;

export const isFledFainted = constant =>
   [EncounterResultConst.FAINTED, EncounterResultConst.FLED].includes(constant);

export const getEncounterErrors = (results, update = false) => {
   const errors = [];
   let species = results.species;
   if (!util.isUndefined(results.species)) {
      if (!util.isUndefined(results.species.text)) species = results.species.text;
   }
   if (isCaught(results.constant)) {
      if (
         rulesController.isActive(GameRules.USE_NICKNAMES) &&
         util.isUndefined(results.nickname)
      ) {
         errors.push('Captured Pokemon need a nickname');
      }
      if (util.isUndefined(species)) {
         errors.push(`You must select a Pokemon`);
      }
      if (
         pokemonController.isParty(results.destination) &&
         util.isUndefined(results.replacement)
      ) {
         errors.push(`You must select a Party Member`);
      }
   } else if (isAvailable(results.constant) && !update) {
      if (!util.isUndefined(species)) {
         errors.push(
            `Something went wrong. Must be Fainted, Fled, or Caught, to have a Pokemon.`
         );
      }
      if (!util.isUndefined(results.nickname)) {
         errors.push(`Something went wrong. Must be Caught to have a nickname.`);
      }
   } else if (isFledFainted(results.constant)) {
      if (!util.isUndefined(results.nickname) && !update) {
         errors.push(`Something went wrong. Must be Caught to have a nickname.`);
      }
      if (util.isUndefined(species)) {
         errors.push(`You must select a Pokemon`);
      }
   }
   if (errors.length > 0) return { errors: errors };
};
