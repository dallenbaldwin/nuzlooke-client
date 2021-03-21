import PartyState from '../constants/PartyState.js';
import store from '../store/store.js';

export const getPartyLength = () =>
   store.state.game.pokemons.filter(p => p.party_state === PartyState.PARTY).length;
