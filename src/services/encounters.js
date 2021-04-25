import APIResponse from '../models/APIResponse';
import nuzlooke from './nuzlooke';

export const getEncountersByVersion = async version => {
   try {
      const response = await nuzlooke().get(`/encounters/${version}`);
      return APIResponse.fromResponse(response);
   } catch (err) {
      return APIResponse.fromError(err);
   }
};
