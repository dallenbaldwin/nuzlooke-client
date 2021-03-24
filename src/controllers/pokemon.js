import PartyState from '../constants/PartyState.js';
import store from '../store/store.js';

export const isParty = constant => constant === PartyState.PARTY;

export const getPartyLength = () =>
   store.state.game.pokemons.filter(p => p.party_state === PartyState.PARTY).length;

export const getPokemonById = id => store.state.game.pokemons.find(p => p.id === id);

export const updatePokemonById = pokemon => {
   store.commit('updatePokemonById', pokemon);
};

export const pushNewPokemon = newPokemon => {
   store.commit('pushNewPokemon', newPokemon);
};
