import nuzlooke from './nuzlooke';

export const createGame = game => nuzlooke().post('/games', game);
export const getGameById = id => nuzlooke().get(`/games/${id}`);
export const updateGameById = (id, game) => nuzlooke().put(`/games/${id}`, game);
export const deleteGameById = id => nuzlooke().delete(`/games/${id}`);
