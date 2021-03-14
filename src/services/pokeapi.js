import Pokedex from 'pokeapi-js-wrapper';

const pokedex = new Pokedex.Pokedex();

export async function getPokemonBySpecies(species, result) {
   try {
      const pokemon = await pokedex.getPokemonByName(species);
      result({ message: 'got a pokemon by species', data: pokemon });
   } catch (err) {
      result({
         message: 'there was an error getting pokemon by species',
         error: err.stack,
      });
   }
}
