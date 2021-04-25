import APIResponse from '../models/APIResponse';
import nuzlooke from './nuzlooke';

export const createGame = async game => {
   try {
      const response = await nuzlooke().post('/games', game);
      return APIResponse.fromResponse(response);
   } catch (err) {
      return APIResponse.fromError(err);
   }
};

export const getGameById = async id => {
   try {
      const response = await nuzlooke().get(`/games/${id}`);
      return APIResponse.fromResponse(response);
   } catch (err) {
      return APIResponse.fromError(err);
   }
};

export const updateGameById = async (id, attributes) => {
   try {
      const response = await nuzlooke().put(`/games/${id}`, attributes);
      return APIResponse.fromResponse(response);
   } catch (err) {
      return APIResponse.fromError(err);
   }
};

export const deleteGameById = async id => {
   try {
      const response = await nuzlooke().delete(`/games/${id}`);
      return APIResponse.fromResponse(response);
   } catch (err) {
      return APIResponse.fromError(err);
   }
};
