import PartyState from '../constants/PartyState.js';
import store from '../store/store.js';

export const isPC = constant => constant === PartyState.PC;

export const isParty = constant => constant === PartyState.PARTY;

export const getPartyLength = () =>
   store.state.game.pokemons.filter(p => p.party_state === PartyState.PARTY).length;

export const getPokemonById = id => store.state.game.pokemons.find(p => p.id === id);

export const updatePokemonInStore = pokemon => {
   store.commit('updatePokemon', pokemon);
};

export const pushNewPokemon = newPokemon => {
   store.commit('pushNewPokemon', newPokemon);
};

export const removeFromList = existingPokemon => {
   console.log(existingPokemon);
   store.commit('removePokemonFromPokemons', existingPokemon);
};
