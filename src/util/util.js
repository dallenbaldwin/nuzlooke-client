import { isMobile } from 'mobile-device-detect';
import store from '../store/store';
import router from '../router/router';
import * as userServices from '../services/user';
import Pages from '../constants/Pages';
import APIResponse from '../models/APIResponse';

export const navigate = endpoint => {
   router.replace(endpoint);
};

export const logout = () => {
   store.commit('exitGame');
   store.commit('logout');
   navigate({ name: Pages.HOME });
};

export const login = () => {
   // FIXME: this will need to be reworked when we get to authorization
   userServices
      .getUserById('dca794f5-c680-42c2-aedb-a33a40200c49')
      .then(res => {
         let user = new APIResponse(res).data;
         store.commit('login', {
            id: user.id,
            username: user.username || user.email,
            games: user.games,
         });
         navigate({ name: Pages.GAMES });
      })
      .catch(err => alert(err.stack));
};
export const exitGame = () => {
   store.commit('exitGame');
   navigate({ name: Pages.GAMES });
};

export const arrayify = (...values) => {
   const a = [];
   values.forEach(value => a.push(value));
   return a.flatMap(i => i); // force it to accept an array of values or a list of values
};

export const deClassify = classObject => JSON.parse(JSON.stringify(classObject));

export const isUndefined = value => value === undefined || value === null || value === '';

export const isEmptyArray = array => array.length === 0;

export const prettySON = json => JSON.stringify(json, null, 2);

export const mobile = () => isMobile;

export const errorCatch = err => prettySON([err.message, err.stack]);
