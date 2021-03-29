import * as userController from '../controllers/user.js';
import { isUndefined } from '../util/util.js';

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
