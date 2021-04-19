import nuzlooke from './nuzlooke';

export const register = creds => nuzlooke().post('/register', creds);
export const login = creds => nuzlooke().post('/login', creds);
export const oauth = (provider, creds) => nuzlooke().post(`/oauth/${provider}`, creds);
