import Pages from '../constants/Pages';
import APIResponse from '../models/APIResponse';
import * as services from '../services/auth';
import store from '../store/store';
import * as util from '../util/util';

export const getValidationErrors = obj => {
   const errors = [];
   if (util.isUndefined(obj.password)) errors.push('You need to enter a password!');
   if (!isEmail(obj.email)) errors.push('Please enter a valid email!');
   if (obj.isRegister && !passwordsMatch(obj.password, obj.confirmPassword))
      errors.push('Your passwords need to match!');
   return {
      hasErrors: errors.length > 0,
      errors: errors,
   };
};

const passwordsMatch = (a, b) => a === b;

const isEmail = email => {
   const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   return pattern.test(email);
};

const login = res => {
   store.commit('login', {
      id: res.id,
      username: res.username || undefined,
      userGames: res.games,
      app_settings: res.app_settings,
      token: res.token,
   });
   util.navigate({ name: Pages.GAMES });
};

export const register = async obj => {
   try {
      let response = await services.register(obj);
      response = APIResponse.fromResponse(response).data;
      login(response);
   } catch (err) {
      return APIResponse.builder()
         .withStatus(err.response.status)
         .withError(err.response.data.error)
         .build();
   }
};

export const authenticate = async obj => {
   try {
      let response = await services.login(obj);
      response = APIResponse.fromResponse(response).data;
      login(response);
   } catch (err) {
      return APIResponse.builder()
         .withStatus(err.response.status)
         .withError(err.response.data.error)
         .build();
   }
};
