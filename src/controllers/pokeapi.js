import * as pokeapiServices from '../services/pokeapi.js';
import UserPokemon from '../models/UserPokemon.js';

export async function buildUserPokemon(result) {
   const pokeData = await pokeapiServices.getPokemonBySpecies(result.species.text);
   const speciesData = await pokeapiServices.get(pokeData.species.url);
   const evoData = await pokeapiServices.get(speciesData.evolution_chain.url);
   return UserPokemon.builder()
      .withSpecies(normalizeKabob(pokeData.species.name))
      .withNickname(result.nickname)
      .withSpritUrl(pokeData.sprites.front_default)
      .withIconUrl(pokeData.sprites.versions['generation-vii'].icons.front_default)
      .withTypes(pokeData.types.map(t => normalizeKabob(t.type.name)))
      .withEvolvesTo(evoData.chain.evolves_to.map(e => normalizeKabob(e.species.name)))
      .build();
}

const normalizeKabob = (string = '') =>
   string
      .split('-')
      .map(s => s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase())
      .join(' ');
