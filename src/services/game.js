import http from './http.js';

export function createGame(game) {
   return http().post('/games', game);
}

export function getGameById(id) {
   return http().get(`/games/${id}`);
}

export function updateGameById(id, game) {
   return http().put(`/games/${id}`, game);
}

export function deleteGameById(id) {
   return http().delete(`/games/${id}`);
}
