import * as userController from '../controllers/user';
import { isUndefined } from '../util/util';
import store from '../store/store';

export const saveSettings = async () => {
   await userController.updateUser({
      username: store.state.username,
      app_settings: store.state.app_settings,
   });
};

export const getValidationErrors = options => {
   const errors = [];
   if (isUndefined(options.username)) errors.push('Username cannot be empty!');
   return {
      errors: errors,
      hasErrors: errors.length > 0,
   };
};

export const saveFilters = async (page, values) => {
   console.log({ page: page, values: values });
   store.commit('savePageFilters', { page: page, values: values });
   await userController.updateUser({ app_settings: store.state.app_settings });
};
