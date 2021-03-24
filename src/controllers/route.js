import store from '../store/store.js';

export const getEncounterById = id => {
   console.log(id);
   return store.state.game.encounters.find(e => id === e.id);
};

export const updateEncounterById = encounter => {
   store.commit('updateEncounterById', { encounter: encounter });
};
