import nuzlooke from './nuzlooke.js';

export function createUser(user) {
   return nuzlooke().post('/users', user);
}

export function getUserById(id) {
   return nuzlooke().get(`/users/${id}`);
}

export function updateUserById(id, user) {
   return nuzlooke().put(`/users/${id}`, user);
}

export function getGamesByUserId(id) {
   return nuzlooke().get(`/users/games/${id}`);
}
