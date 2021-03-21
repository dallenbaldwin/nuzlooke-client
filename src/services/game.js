import nuzlooke from './nuzlooke.js';

export function createGame(game) {
   return nuzlooke().post('/games', game);
}

export function getGameById(id) {
   return nuzlooke().get(`/games/${id}`);
}

export function updateGameById(id, game) {
   return nuzlooke().put(`/games/${id}`, game);
}

export function deleteGameById(id) {
   return nuzlooke().delete(`/games/${id}`);
}
