import * as userController from '../controllers/user';
import { isUndefined } from '../util/util';
import store from '../store/store';

export const saveSettings = async options => {
   store.commit('setUsername', options.username);
   const response = await userController.updateUser({
      username: store.state.username,
      app_settings: store.state.app_settings,
   });
   if (response && response.errors) return response;
};

export const getValidationErrors = options => {
   const errors = [];
   if (isUndefined(options.username)) errors.push('Username cannot be empty');
   if (errors.length > 0) return { errors: errors };
};

export const saveFilters = async (page, values) => {
   console.log({ page: page, values: values });
   store.commit('savePageFilters', { page: page, values: values });
   const response = await userController.updateUser({
      app_settings: store.state.app_settings,
   });
   if (response && response.errors) return response;
};
