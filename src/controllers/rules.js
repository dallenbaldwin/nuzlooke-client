import GameRules from '../constants/GameRules';
import * as util from '../util/util';
import store from '../store/store';
import GameRule from '../models/GameRule';
import { updateGameRulesInDB } from './game';

const gameRules = Object.values(GameRules);

export const isActive = gameRule =>
   store.state.game.game_rules.find(g => g.id === gameRule.id).is_active;

export const getAvailableStockRules = () => {
   return (
      gameRules
         // FIXME when we replace code with id, change this to correct filter
         .filter(r => !store.state.game.game_rules.map(r => r.id).includes(r.id))
         // .filter(r => !store.state.game.game_rules.map(gr => gr.code).includes(r.id))
         .map(r => Object({ value: r.id, text: r.label }))
   );
};

export const createNewRule = async options => {
   let newRule;
   if (!util.isUndefined(options.label)) {
      newRule = GameRule.builder()
         .withId(0)
         .withLabel(options.label)
         .withDescription(options.description)
         .withIsActive(true)
         .build();
   } else if (!util.isUndefined(options.stock)) {
      const stockRule = gameRules.find(gr => gr.id === options.stock.value);
      newRule = stockRule;
      newRule.is_active = true;
   }
   store.commit('addNewRule', newRule);
   updateGameRulesInDB(store.state.game);
};

export const getValidationErrors = options => {
   const errors = [];
   if (
      util.isUndefined(options.stock) &&
      util.isUndefined(options.label) &&
      util.isUndefined(options.description)
   ) {
      errors.push('You must select a Pre-defined Rule or define a Custom Rule!');
   } else if (
      !util.isUndefined(options.stock) &&
      util.isUndefined(options.label) &&
      util.isUndefined(options.description)
   ) {
      return { hasErrors: false };
   } else if (
      util.isUndefined(options.stock) &&
      (util.isUndefined(options.label) || util.isUndefined(options.description))
   ) {
      if (util.isUndefined(options.label)) errors.push('You must give rules a Name!');
      if (util.isUndefined(options.description))
         errors.push('You must give rules a Description!');
   }
   return {
      errors: errors,
      hasErrors: errors.length > 0,
   };
};
