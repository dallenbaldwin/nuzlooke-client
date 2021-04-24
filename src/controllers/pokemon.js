import PartyState from '../constants/PartyState';
import * as util from '../util/util';
import * as gameServices from '../services/game';
import * as userController from '../controllers/user';
import UserPokemon from '../models/UserPokemon';
import store from '../store/store';
import Icons from '../constants/Icons';
import * as pokeapiController from './pokeapi';

export const PARTY_MAX_SIZE = 6;

export const isPC = constant => constant === PartyState.PC;

export const isParty = constant => constant === PartyState.PARTY;

export const isGraveyard = constant => constant === PartyState.GRAVEYARD;

export const getPartyLength = () =>
   store.state.game.pokemons.filter(p => p.party_state === PartyState.PARTY).length;

export const getPokemonById = id => store.state.game.pokemons.find(p => p.id === id);

export const evolvePokemon = async (pokemon, evolvesTo) => {
   const evolved = await pokeapiController.buildUserPokemon(
      evolvesTo,
      pokemon.nickname,
      pokemon.party_state
   );
   evolved.id = pokemon.id;
   await updatePokemonsAndGame(evolved);
};

export const updatePokemonsAndGame = async pokemon => {
   updatePokemonInStore(pokemon);
   updatePokemonsInDB();
   userController.updateSnapshotPartyUrls(store.state.game.id);
   await userController.updateUserGames();
};

export const sendToStorage = pokemon => {
   pokemon.party_state = PartyState.PC;
   updatePokemonsAndGame(pokemon);
};

export const sendToParty = pokemon => {
   pokemon.party_state = PartyState.PARTY;
   updatePokemonsAndGame(pokemon);
};

export const sendToGraveyard = async pokemon => {
   pokemon.party_state = PartyState.GRAVEYARD;
   await updatePokemonsAndGame(pokemon);
};

export const updatePokemonInStore = pokemon => {
   store.commit('updatePokemon', pokemon);
};

// TODO after game service reconfigure, check that this works of if we need to change it
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
