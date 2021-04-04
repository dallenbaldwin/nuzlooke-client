import * as pokeapiServices from '../services/pokeapi';
import UserPokemon from '../models/UserPokemon';
import { errorCatch } from '../util/util';

export const buildUserPokemon = async (species, nickname, partyState) => {
   try {
      species = species.toLowerCase();
      const pokeData = await pokeapiServices.getPokemonBySpecies(species);
      const speciesData = await pokeapiServices.get(pokeData.species.url);
      const evoData = await pokeapiServices.get(speciesData.evolution_chain.url);
      const evolvesTo = getNextEvolution(evoData.chain, species);
      return UserPokemon.builder()
         .withSpecies(normalizeKabob(pokeData.species.name))
         .withNickname(nickname)
         .withPartyState(partyState)
         .withSpritUrl(pokeData.sprites.front_default)
         .withIconUrl(pokeData.sprites.versions['generation-vii'].icons.front_default)
         .withTypes(pokeData.types.map(t => normalizeKabob(t.type.name)))
         .withEvolvesTo(evolvesTo)
         .build();
   } catch (err) {
      alert(errorCatch(err));
   }
};

const getNextEvolution = (chain, currentSpecies) => {
   // debugger;
   if (chain.species.name === currentSpecies) {
      let evolvesTo = chain.evolves_to.map(e => normalizeKabob(e.species.name));
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

const normalizeKabob = (string = '') =>
   string
      .split('-')
      .map(s => s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase())
      .join(' ');
