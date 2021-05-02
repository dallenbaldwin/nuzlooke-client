import Pages from '../constants/Pages';
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
   if (errors.length > 0) return { errors: errors };
};

const isEmail = email => {
   const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   return pattern.test(email);
};

const login = response => {
   store.commit('login', {
      id: response.id,
      username: response.username || undefined,
      userGames: response.games,
      app_settings: response.app_settings,
      token: response.token,
   });
   util.navigate({ name: Pages.GAMES });
};

export const logout = async () => {
   if (store.state.fbToken) await logoutFacebook();
   store.commit('exitGame');
   store.commit('logout');
   util.navigate({ name: Pages.HOME });
};

export const register = async obj => {
   const user = User.builder()
      .withEmail(obj.email)
      .withPassword(obj.password)
      .build();
   const response = await services.register(user);
   return login(response);
};

export const authenticate = async obj => {
   const user = User.builder()
      .withEmail(obj.email)
      .withPassword(obj.password)
      .build();
   const response = await services.login(user);
   return login(response);
};

export const loginWithGoogle = async token => {
   const response = await services.oauth('google', { token: token });
   if (response && response.errors) return response;
   login(response.data);
};

export const loginWithFacebook = async token => {
   const response = await services.oauth('facebook', { token: token });
   if (response && response.errors) return response;
   store.commit('setFbToken', token);
   login(response.data);
};

export const logoutFacebook = async () => {
   await new Promise(resolve => {
      FB.logout(response => {
         console.log('logging out of facebook...');
         resolve();
      });
   });
};
