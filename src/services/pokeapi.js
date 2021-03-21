import axios from 'axios';

const pokeapi = axios.create({
      baseURL: 'https://pokeapi.co/api/v2',
      // headers: {
      //    Authorization: auth.getToken()
      // }
   });
}

export function getPokemonBySpecies(species) {
 
}
