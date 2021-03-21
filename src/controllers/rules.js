import store from '../store/store.js';

export const isActive = ruleCode =>
   store.state.game.game_rules.map(r => r.code).includes(ruleCode);
