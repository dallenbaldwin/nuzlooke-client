import * as userController from '../controllers/user';
import { isUndefined } from '../util/util';
import store from '../store/store';

// TODO implement error handling
export const saveSettings = async () => {
   const response = await userController.updateUser({
      username: store.state.username,
      app_settings: store.state.app_settings,
   });
   if (response && response.error) return response;
};

export const getValidationErrors = options => {
   const errors = [];
   if (isUndefined(options.username)) errors.push('Username cannot be empty');
   return {
      errors: errors,
      hasErrors: errors.length > 0,
   };
};

// TODO implement error handling
export const saveFilters = async (page, values) => {
   console.log({ page: page, values: values });
   store.commit('savePageFilters', { page: page, values: values });
   const response = await userController.updateUser({
      app_settings: store.state.app_settings,
   });
   if (response && response.error) return response;
};
