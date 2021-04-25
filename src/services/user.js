import APIResponse from '../models/APIResponse';
import nuzlooke from './nuzlooke';

export const createUser = async user => {
   try {
      const response = await nuzlooke().post('/users', user);
      return APIResponse.fromResponse(response);
   } catch (err) {
      return APIResponse.fromError(err);
   }
};

export const getUserById = async id => {
   try {
      const response = await nuzlooke().get(`/users/${id}`);
      return APIResponse.fromResponse(response);
   } catch (err) {
      return APIResponse.fromError(err);
   }
};

export const updateUserById = async (id, attributes) => {
   try {
      const response = await nuzlooke().put(`/users/${id}`, attributes);
      return APIResponse.fromResponse(response);
   } catch (err) {
      return APIResponse.fromError(err);
   }
};
