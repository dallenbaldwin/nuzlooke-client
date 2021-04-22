import * as pokeapiServices from '../services/pokeapi';
import UserPokemon from '../models/UserPokemon';
import { errorCatch } from '../util/util';
import store from '../store/store';

export const buildUserPokemon = async (species, nickname, partyState) => {
   try {
      species = species.toLowerCase();
      const pokeData = await pokeapiServices.getPokemonBySpecies(species);
      const speciesData = await pokeapiServices.get(pokeData.species.url);
      const evoData = await pokeapiServices.get(speciesData.evolution_chain.url);
      const evolvesTo = getNextEvolution(evoData.chain, species);
      const evolvesToPokemon = await validateEvolutions(evolvesTo);
      const english = getEnglish(speciesData.names);
      return (
         UserPokemon.builder()
            .withSpecies(english ? english : normalizeKabob(pokeData.species.name))
            .withNickname(nickname)
            .withPartyState(partyState)
            .withSpritUrl(pokeData.sprites.front_default)
            // this will have to be refactored eventually
            .withIconUrl(pokeData.sprites.versions['generation-vii'].icons.front_default)
            .withTypes(pokeData.types.map(t => normalizeKabob(t.type.name)))
            .withEvolvesTo(evolvesToPokemon)
            .build()
      );
   } catch (err) {
      alert(errorCatch(err));
   }
};

const getEnglish = languages => {
   const english = languages.find(name => name.language.name === 'en');
   return english ? english.name : undefined;
};

const getNextEvolution = (chain, currentSpecies) => {
   if (chain.species.name === currentSpecies) {
      let evolvesTo = chain.evolves_to.map(e => e.species);
      return evolvesTo;
   } else {
      // don't know why i have to do this... it feels REALLY hacky
      if (chain.evolves_to.length > 1) {
         chain.evolves_to.forEach(chain => {
            return getNextEvolution(chain, currentSpecies);
         });
      } else if (chain.evolves_to.length == 1) {
         return getNextEvolution(chain.evolves_to[0], currentSpecies);
      } else {
         return;
      }
   }
};

const validateEvolutions = async evolutions => {
   if (!evolutions) return;
   const version = store.state.game.version.version; // should never be able to call this method when game doesn't exist
   const validEvolutions = [];
   for (let evolution of evolutions) {
      const pokeData = await pokeapiServices.getPokemonBySpecies(evolution.name);
      const isValid = pokeData.game_indices.map(i => i.version.name).includes(version);
      if (isValid) {
         const speciesData = await pokeapiServices.get(evolution.url);
         const english = getEnglish(speciesData.names);
         if (english) validEvolutions.push(english);
      }
   }
   return validEvolutions;
};

const normalizeKabob = (string = '') =>
   string
      .split('-')
      .map(s => s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase())
      .join(' ');
