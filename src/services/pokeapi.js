import axios from 'axios';

const baseURL = 'https://pokeapi.co/api/v2';

const pokeapi = axios.create({});

export async function get(endpoint) {
   try {
      let response = await pokeapi.get(endpoint);
      return response.data;
   } catch (err) {
      alert(err);
   }
}

export async function getPokemonBySpecies(species = 'ditto') {
   species = species.toLowerCase();
   try {
      let response = await pokeapi.get(`${baseURL}/pokemon/${species}`);
      return response.data;
   } catch (err) {
      alert(err);
   }
}
