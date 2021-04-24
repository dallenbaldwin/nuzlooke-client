import nuzlooke from './nuzlooke';

export const getEncountersByVersion = version => nuzlooke().get(`/encounters/${version}`);
