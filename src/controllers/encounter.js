import store from '../store/store.js';
import RuleCodes from '../constants/RuleCodes.js';
import EncounterResultConst from '../constants/EncounterResultConst.js';
import * as util from '../util/util.js';
import * as rulesController from '../controllers/rules.js';

export const isAvailable = constant => constant === EncounterResultConst.AVAILABLE;

export const isCaught = constant => constant === EncounterResultConst.CAUGHT;

export const isFledFainted = constant =>
   [EncounterResultConst.FAINTED, EncounterResultConst.FLED].includes(constant);

export const getEncounterErrors = results => {
   console.log(results);
   const errors = [];
   const species = !util.isUndefined(results.species)
      ? results.species.text
      : results.species;
   if (isCaught(results.constant)) {
      if (
         rulesController.isActive(RuleCodes.USE_NICKNAMES.code) &&
         util.isUndefined(results.nickname)
      ) {
         errors.push('Captured Pokemon need a nickname!');
      }
      if (util.isUndefined(species)) {
         errors.push(`You must select a Pokemon!`);
      }
   } else if (isAvailable(results.constant)) {
      if (!util.isUndefined(species)) {
         errors.push(
            `Something went wrong. Must be Fainted, Fled, or Caught, to have a Pokemon.`
         );
      }
      if (!util.isUndefined(results.nickname)) {
         errors.push(`Something went wrong. Must be Caught to have a nickname.`);
      }
   } else if (isFledFainted(results.constant)) {
      if (!util.isUndefined(results.nickname)) {
         errors.push(`Something went wrong. Must be Caught to have a nickname.`);
      }
      if (util.isUndefined(species)) {
         errors.push(`You must select a Pokemon!`);
      }
   }
   return errors;
};
