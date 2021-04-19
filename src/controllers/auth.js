import Pages from '../constants/Pages';
import APIResponse from '../models/APIResponse';
import User from '../models/User';
import * as services from '../services/auth';
import store from '../store/store';
import * as util from '../util/util';

export const getValidationErrors = obj => {
   const errors = [];
   if (util.isUndefined(obj.password)) errors.push('Please enter a password');
   if (!isEmail(obj.email)) errors.push('Please enter a valid email');
   if (obj.isRegister && obj.password !== obj.confirmPassword)
      errors.push('The entered passwords do not match');
   return {
      hasErrors: errors.length > 0,
      errors: errors,
   };
};

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
      const user = User.builder()
         .withEmail(obj.email)
         .withPassword(obj.password)
         .build();
      let response = await services.register(user);
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
      const user = User.builder()
         .withEmail(obj.email)
         .withPassword(obj.password)
         .build();
      let response = await services.login(user);
      response = APIResponse.fromResponse(response).data;
      login(response);
   } catch (err) {
      return APIResponse.builder()
         .withStatus(err.response.status)
         .withError(err.response.data.error)
         .build();
   }
};

export const loginWithGoogle = async googleUser => {
   try {
      let response = await services.oauth('google', googleUser);
      response = APIResponse.fromResponse(response).data;
      login(response);
   } catch (err) {
      console.log(err);
      return APIResponse.builder()
         .withStatus(err.response.status)
         .withError(err.response.data.error)
         .build();
   }
};
