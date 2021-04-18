import nuzlooke from './nuzlooke';

export const createUser = user => nuzlooke().post('/users', user);
export const getUserById = id => nuzlooke().get(`/users/${id}`);
export const updateUserById = (id, user) => nuzlooke().put(`/users/${id}`, user);
