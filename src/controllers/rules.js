import GameRules from '../constants/GameRules';
import * as util from '../util/util';
import store from '../store/store';
import GameRule from '../models/GameRule';
import { updateGameRulesInDB } from './game';

const gameRules = Object.values(GameRules);

const currentRules = store.state.game.game_rules;

export const isActive = gameRule =>
   currentRules.find(g => g.id === gameRule.id).is_active;

export const getAvailableStockRules = () => {
   return gameRules
      .filter(r => !currentRules.map(r => r.id).includes(r.id))
      .map(r => Object({ value: r.id, text: r.label }));
};

const buildCustomRule = options => {
   return GameRule.builder()
      .withId(0)
      .withLabel(options.label)
      .withDescription(options.description)
      .withIsActive(true)
      .build();
};

const buildDefaultRule = options => {
   const stockRule = gameRules.find(gr => gr.id === options.stock.value);
   stockRule.is_active = true;
   return stockRule;
};

export const createNewRule = async options => {
   let newRule;
   if (options.useStock) {
      newRule = buildDefaultRule(options);
   } else {
      newRule = buildCustomRule(options);
   }
   store.commit('addNewRule', newRule);
   await updateGameRulesInDB(store.state.game);
};

export const updateRule = async options => {
   if (options.useStock) {
      updateRuleById(options);
   } else {
      updateRuleByLabel(options);
   }
   await updateGameRulesInDB(store.state.game);
};

const updateRuleById = options => {
   store.commit('updateRuleById', { id: options.oldId, rule: buildDefaultRule(options) });
};

const updateRuleByLabel = options => {
   store.commit('updateRuleByLabel', {
      label: options.oldLabel,
      rule: buildCustomRule(options),
   });
};

export const deleteRule = async rule => {
   if (rule.id === 0) store.commit('deleteExistingRuleByLabel', rule);
   else store.commit('deleteExistingRuleById', rule);
   await updateGameRulesInDB(store.state.game);
};

export const getValidationErrors = options => {
   const errors = [];
   if (options.useStock) {
      // check for stock errors
      if (util.isUndefined(options.stock))
         errors.push('You must select a Pre-defined Rule!');
      if (
         !util.isUndefined(options.stock) &&
         currentRules.map(r => r.id).includes(options.stock.value)
      )
         errors.push('This Rule already exists!');
   } else {
      // check for custom errors
      if (util.isUndefined(options.label)) errors.push('You must give rules a Name!');
      if (util.isUndefined(options.description))
         errors.push('You must give rules a Description!');
      // only need to worry about adding new custom rules
      if (
         !options.isUpdate &&
         !util.isUndefined(options.label) &&
         currentRules
            .map(r => r.label.toLowerCase())
            .includes(options.label.toLowerCase())
      )
         errors.push('This Rule already exists!');
   }
   return {
      errors: errors,
      hasErrors: errors.length > 0,
   };
};
