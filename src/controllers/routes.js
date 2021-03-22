import store from '../store/store.js';

export const getEncounterById = id => store.state.game.encounters.find(e => id === e.id);

export const updateEncounterById = encounter => {
   store.commit('updateEncounterById', { encounter: encounter });
};
