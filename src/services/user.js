import http from './http.js';

export function createUser(user) {
   return http().post('/users', user);
}

export function getUserById(id) {
   return http().get(`/users/${id}`);
}

export function updateUserById(id, user) {
   return http().put(`/users/${id}`, user);
}

export function getGamesByUserId(id) {
   return http().get(`/users/games/${id}`);
}
