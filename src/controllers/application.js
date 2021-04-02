import * as userController from '../controllers/user';
import { isUndefined } from '../util/util';

export const saveSettings = async options => {
   userController.updateUser({ username: options.username });
};

export const getValidationErrors = options => {
   const errors = [];
   if (isUndefined(options.username)) errors.push('Username cannot be empty!');
   return {
      errors: errors,
      hasErrors: errors.length > 0,
   };
};
