import axios from 'axios';
import APIResponse from '../models/APIResponse';

const baseURL = 'https://pokeapi.co/api/v2';

const pokeapi = axios.create({});

export const get = async endpoint => {
   try {
      const response = await pokeapi.get(endpoint);
      return APIResponse.builder()
         .withData(response.data)
         .withStatus(response.status)
         .build();
   } catch (err) {
      return APIResponse.builder()
         .withError(err.response.data)
         .withStatus(err.response.status)
         .build();
   }
};

export const getPokemonBySpecies = async (species = 'ditto') => {
   species = species.toLowerCase();
   try {
      const response = await pokeapi.get(`${baseURL}/pokemon/${species}`);
      return APIResponse.builder()
         .withData(response.data)
         .withStatus(response.status)
         .build();
   } catch (err) {
      return APIResponse.builder()
         .withError(err.response.data)
         .withStatus(err.response.status)
         .build();
   }
};
