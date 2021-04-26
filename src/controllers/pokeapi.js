import * as services from '../services/pokeapi';
import UserPokemon from '../models/UserPokemon';
import store from '../store/store';

export const buildUserPokemon = async (species, nickname, partyState) => {
   species = species.toLowerCase();
   const pokeData = await services.getPokemonBySpecies(species);
   if (pokeData && pokeData.errors) return pokeData;
   const speciesData = await services.get(pokeData.data.species.url);
   if (speciesData && speciesData.errors) return speciesData;
   const evoData = await services.get(speciesData.data.evolution_chain.url);
   if (evoData && evoData.errors) return evoData;
   const evolvesTo = getNextEvolution(evoData.data.chain, species);
   const evolvesToPokemon = await getValidEvolutions(evolvesTo);
   if (evolvesToPokemon && evolvesToPokemon.errors) return evolvesToPokemon;
   const english = getEnglish(speciesData.data.names);
   return (
      UserPokemon.builder()
         .withSpecies(english ? english : normalizeKabob(pokeData.data.species.name))
         .withNickname(nickname)
         .withPartyState(partyState)
         .withSpritUrl(pokeData.data.sprites.front_default)
         // this will have to be refactored eventually
         .withIconUrl(
            pokeData.data.sprites.versions['generation-vii'].icons.front_default
         )
         .withTypes(pokeData.data.types.map(t => normalizeKabob(t.type.name)))
         .withEvolvesTo(evolvesToPokemon)
         .build()
   );
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

const getValidEvolutions = async evolutions => {
   if (!evolutions) return;
   const version = store.state.game.version.version; // should never be able to call this method when game doesn't exist
   const validEvolutions = [];
   for (let evolution of evolutions) {
      const pokeData = await services.getPokemonBySpecies(evolution.name);
      if (pokeData && pokeData.errors) return pokeData;
      const isValid = pokeData.data.game_indices
         .map(i => i.version.name)
         .includes(version);
      if (isValid) {
         const speciesData = await services.get(evolution.url);
         if (speciesData && speciesData.errors) return speciesData;
         const english = getEnglish(speciesData.data.names);
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
