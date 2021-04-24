import APIResponse from '../models/APIResponse';
import nuzlooke from './nuzlooke';

export const register = async creds => {
   try {
      const response = await nuzlooke().post('/register', creds);
      return APIResponse.fromResponse(response);
   } catch (err) {
      return APIResponse.fromError(err);
   }
};

export const login = async creds => {
   try {
      const response = await nuzlooke().post('/login', creds);
      return APIResponse.fromResponse(response);
   } catch (err) {
      return APIResponse.fromError(err);
   }
};

export const oauth = async (provider, creds) => {
   try {
      const response = await nuzlooke().post(`/oauth/${provider}`, creds);
      return APIResponse.fromResponse(response);
   } catch (err) {
      return APIResponse.fromError(err);
   }
};
