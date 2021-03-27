import PartyState from '../constants/PartyState.js';
import * as util from '../util/util.js';
import * as gameServices from '../services/game.js';
import * as userController from '../controllers/user.js';
import store from '../store/store.js';
import Icons from '../constants/Icons.js';

export const PARTY_MAX_SIZE = 6;

export const isPC = constant => constant === PartyState.PC;

export const isParty = constant => constant === PartyState.PARTY;

export const isGraveyard = constant => constant === PartyState.GRAVEYARD;

export const getPartyLength = () =>
   store.state.game.pokemons.filter(p => p.party_state === PartyState.PARTY).length;

export const getPokemonById = id => store.state.game.pokemons.find(p => p.id === id);

export const updatePokemonsAndGame = pokemon => {
   updatePokemonInStore(pokemon);
   updatePokemonsInDB();
   userController.updateSnapshotPartyUrls(store.state.game.id);
   userController.updateUserGames();
};

export const sendToStorage = pokemon => {
   pokemon.party_state = PartyState.PC;
   updatePokemonsAndGame(pokemon);
};

export const sendToParty = pokemon => {
   pokemon.party_state = PartyState.PARTY;
   updatePokemonsAndGame(pokemon);
};

export const updatePokemonInStore = pokemon => {
   store.commit('updatePokemon', pokemon);
};

export const updatePokemonsInDB = () => {
   gameServices.updateGameById(store.state.game.id, {
      pokemons: store.state.game.pokemons,
   });
};

export const pushNewPokemon = newPokemon => {
   store.commit('pushNewPokemon', newPokemon);
};

export const removeFromList = existingPokemon => {
   store.commit('removePokemonFromPokemons', existingPokemon);
};

export const getPartyStateIcon = partyState => {
   if (partyState === PartyState.PC) return Icons.CONTROLS.STORAGE;
   else if (partyState === PartyState.GRAVEYARD) return Icons.CONTROLS.TOMBSTONE;
};
